# Virtual Psychiatrist Dashboard

A React-based dashboard UI for a virtual psychiatrist application, with a Claude AI-like interface.

## Features

- Chat-based interface for interacting with your virtual psychiatrist model
- Conversation history sidebar
- Azure cloud integration for data storage
- Responsive design
- Dark mode support
- User profile management

## Prerequisites

- Node.js 16.x or later
- npm or yarn
- Azure Storage account (for production)

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/virtual-psychiatrist-dashboard.git
cd virtual-psychiatrist-dashboard
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
Create a `.env` file in the root directory and add your Azure credentials:

```
REACT_APP_AZURE_STORAGE_CONNECTION_STRING=your_connection_string_here
REACT_APP_AZURE_API_URL=your_api_url_here
REACT_APP_AZURE_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Integration with Your Neural Network Model

To integrate with your own deep neural network model:

1. Update the `simulateResponse` function in `useConversation.js` to call your model API
2. Modify the Azure service in `azureService.js` to connect to your specific Azure resources
3. Update any data structures or formats to match your model's requirements

## Deployment

Build the application for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory and can be deployed to any static hosting service or integrated with your backend application.

## Azure Cloud Integration

This application is set up to use Azure Blob Storage for conversation data. To configure your Azure environment:

1. Create an Azure Storage account
2. Create a container named `psychiatrist-conversations` (or update the default in settings)
3. Generate a connection string with appropriate permissions
4. Add the connection string to your environment variables

## Customization

- Update colors and branding in `global.css`
- Modify the UI components in the components directory
- Add additional features or settings as needed

## License

[MIT](LICENSE)