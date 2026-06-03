const API_BASE_URL = 'http://localhost:3000/agenciaViajes'; 

export const sendChatMessage = async (message, history) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const data = await response.json();
    return data.reply; 
  } catch (error) {
    console.error('Error en sendChatMessage:', error);
    throw error;
  }
};