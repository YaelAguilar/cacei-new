import { MdHome } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const NotFoundComponent: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center max-w-md mx-auto p-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.714-2.623L5 10l1.286-2.377C7.71 6.009 9.66 5 12 5s4.29 1.009 5.714 2.623L19 10l-1.286 2.377A7.963 7.963 0 0112 15z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-4">📄 Página no encontrada</h1>
                <p className="text-gray-600 mb-6">
                    La página que buscas no existe o ha sido movida.
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                        ← Volver
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                        <MdHome className="w-5 h-5" />
                        Inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundComponent;