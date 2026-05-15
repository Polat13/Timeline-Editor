const BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log('BASE_URL:', BASE_URL);

export const saveTimeline = async (timeline) => {
  const response = await fetch(`${BASE_URL}/timeline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: timeline.content,
      createdAt: timeline.createdAt,
    }),
  });

  if (!response.ok) {
    throw new Error('Kaydetme başarısız');
  }

  return await response.json();
};