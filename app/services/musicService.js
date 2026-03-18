export const searchMusic = async (query) => {
  try {
    // الاتصال بالـ API Route الذي أنشأناه للتو في خطوة 1
    const response = await fetch(`/api/music?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.data || []; 
  } catch (error) {
    console.error("Music Service Error:", error);
    return [];
  }
};