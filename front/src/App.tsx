import { AuthProvider } from './core/utils/AuthContext';
import DynamicRouter from './core/navigation/DynamicRouter';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <DynamicRouter />
    </AuthProvider>
  );
}

export default App;