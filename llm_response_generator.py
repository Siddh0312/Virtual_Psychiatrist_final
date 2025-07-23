import json
import re
import os
from sentence_transformers import SentenceTransformer, util
from google import genai
from environs import Env
from langchain.memory import ConversationBufferMemory

# Initialize environment and Gemini client.
env = Env()
env.read_env()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyA-gW0CsUx8kSA7TBaYCxpzRV7fKquvGoo")
client = genai.Client(api_key=GEMINI_API_KEY)

# Load the SentenceTransformer model
st_model = SentenceTransformer("all-MiniLM-L6-v2")

# Conversation memory
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
conversation_turn = 0

# Emotion transitions
target_emotion_map = {
    "Guilt": "Self-Compassion",
    "Overwhelm": "Clarity",
    "Procrastination": "Motivation",
    "Fear": "Courage",
    "Sadness": "Hope",
    "Frustration": "Calm",
    "Anxiety": "Reassurance",
    "Hopelessness": "Optimism",
    "Confusion": "Understanding",
    "Self-Doubt": "Confidence",
    "Stress": "Relief",
    "Insecurity": "Assurance"
}

def parse_conversation(conversation_str):
    header_pattern = r"^(?:Here is the conversation:|Here is a structured student counseling session's conversation:|Here is the counseling session conversation:)\s*"
    conversation_str = re.sub(header_pattern, "", conversation_str, flags=re.IGNORECASE)
    pattern = r"\\(Student|Counselor|Final Advice)\\:\s*(.?)(?=\n\\(Student|Counselor|Final Advice)\\*:|$)"
    matches = re.findall(pattern, conversation_str, re.DOTALL)
    turns = []
    for speaker, text, _ in matches:
        cleaned_text = text.strip().replace("\n", " ")
        turns.append({"speaker": speaker, "text": cleaned_text})
    return turns

def extract_student_statement(session):
    if "student_first_statement" in session and session["student_first_statement"].strip():
        return session["student_first_statement"].strip()
    conversation_field = session.get("conversation", "")
    if isinstance(conversation_field, str):
        turns = parse_conversation(conversation_field)
        for turn in turns:
            if turn.get("speaker", "").lower() == "student":
                return turn.get("text", "").strip()
    return ""

def load_dataset_entries(dataset_path):
    with open(dataset_path, "r") as f:
        data = json.load(f)
    entries = []
    for session in data:
        student_text = extract_student_statement(session)
        if not student_text:
            continue
        embedding = st_model.encode(student_text, convert_to_tensor=True)
        entry = {
            "session_id": session.get("session_id"),
            "student_emotion_before": session.get("student_emotion_before", ""),
            "student_emotion_after": session.get("student_emotion_after", ""),
            "primary_issue": session.get("primary_issue", ""),
            "conversation": session.get("conversation", ""),
            "text": student_text,
            "embedding": embedding
        }
        entries.append(entry)
    return entries

def build_context_from_entries(entries):
    context_list = []
    for entry in entries:
        snippet = entry["text"][:300]
        context_list.append(
            f"Session ID: {entry['session_id']}\n"
            f"Issue: {entry['primary_issue']}\n"
            f"Emotion Before: {entry['student_emotion_before']}\n"
            f"Emotion After: {entry['student_emotion_after']}\n"
            f"Excerpt: {snippet}..."
        )
    return "\n\n".join(context_list)

def retrieve_relevant_entries(student_query, dataset_entries, top_k=5):
    query_embedding = st_model.encode(student_query, convert_to_tensor=True)
    similarities = [(util.cos_sim(query_embedding, entry["embedding"]).item(), entry) for entry in dataset_entries]
    top_entries = [entry for _, entry in sorted(similarities, key=lambda x: x[0], reverse=True)[:top_k]]
    return top_entries

def update_memory(student_input, bot_response):
    memory.chat_memory.add_user_message(student_input)
    memory.chat_memory.add_ai_message(bot_response)

def get_formatted_conversation():
    return memory.load_memory_variables({})["chat_history"]

def build_gemini_prompt(student_query, context_str, past_conversation, baseline_emotion, target_emotion):
    return [
        {
            "role": "model",
            "parts": [{
                "text": (
                    f"You are an empathetic and insightful virtual psychiatrist.\n"
                    f"Your goal is to understand the student’s emotional state and gently guide them toward emotional relief.\n\n"
                    f"---\nBaseline Emotion: {baseline_emotion}\nTarget Emotion: {target_emotion}\n---\n\n"
                    f"🧠 Past relevant cases (retrieved from knowledge base):\n{context_str}\n\n"
                    f"🗃️ Ongoing conversation so far:\n{past_conversation}\n\n"
                    f"💬 Now, respond to the student in a structured counseling manner. Follow this progression:\n"
                    f"1. Start with empathy. Understand the student’s current emotions and thoughts.\n"
                    f"2. Ask reflective or clarifying questions to deepen your understanding.\n"
                    f"3. Slowly shift the tone to positive guidance, advice, and reassurance.\n"
                    f"4. Move the student gently toward the target emotion: {target_emotion}.\n\n"
                    f"Keep it natural and conversational. Do not rush to solutions. Prioritize emotional connection."
                )
            }]
        },
        {
            "role": "user",
            "parts": [{"text": student_query}]
        }
    ]

def generate_response_with_rag(student_query, dataset_entries):
    top_entries = retrieve_relevant_entries(student_query, dataset_entries, top_k=5)
    context_str = build_context_from_entries(top_entries)

    baseline_emotion = top_entries[0].get("student_emotion_before", "Unknown") if top_entries else "Unknown"
    target_emotion = target_emotion_map.get(baseline_emotion, "Relief")

    past_conversation = get_formatted_conversation()

    final_prompt = build_gemini_prompt(
        student_query=student_query,
        context_str=context_str,
        past_conversation=past_conversation,
        baseline_emotion=baseline_emotion,
        target_emotion=target_emotion
    )

    response = client.models.generate_content_stream(
        model="gemini-1.5-pro",
        contents=final_prompt,
    )

    response_text = ""
    for chunk in response:
        response_text += chunk.text

    update_memory(student_query, response_text)
    return response_text.strip()

def chatbot_interface():
    global conversation_turn
    DATASET_PATH = "student_psychiatric_sessions_balanced (3).json"
    dataset_entries = load_dataset_entries(DATASET_PATH)
    print(f"Loaded {len(dataset_entries)} session entries from dataset.\n")
    print("Welcome to the Psychiatric Chatbot Interface!")
    print("Type your message below (or type 'exit' to quit):\n")

    while True:
        student_query = input("Student: ")
        if student_query.lower().strip() == "exit":
            print("Exiting chat. Take care!")
            break

        conversation_turn += 1
        response = generate_response_with_rag(student_query, dataset_entries)
        print("\nChatbot:", response, "\n")

if _name_ == "_main_":
    chatbot_interface()
