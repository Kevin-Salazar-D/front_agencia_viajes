import { Settings } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const UserSettingsIcon = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/perfil/configuracion'); 
  };

  return (
    <button 
      onClick={handleClick}
      className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
      title="Configuraciones de usuario"
    >
      <Settings className="w-6 h-6 text-gray-600 hover:text-blue-600" />
    </button>
  );
};

export default UserSettingsIcon;