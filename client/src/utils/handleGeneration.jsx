const handleGeneration = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/generate-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result };
    } else {
      return { success: false, error: result?.detail || 'Unknown server error' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default handleGeneration;
