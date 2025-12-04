const API_KEY = "nDhYTKdSMXEnPG3D2whfFA==0cFiHa2p49VduG1P";

export async function getNutrition(foodName, weight) {
  const query = `${foodName} ${weight}g`;

  try {
    const res = await fetch(
      `https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`,
      { headers: { "X-Api-Key": API_KEY } }
    );

    const result = await res.json();

    if (!result || result.length === 0) return null;

    const item = result[0];

    // 단백질 값이 무료에서 제공되지 않을 때
    const protein =
      typeof item.protein_g === "number" ? item.protein_g : 0;

    return {
      calories: item.calories,
      carbs: item.carbohydrates_total_g,
      protein: protein, // 0으로 처리
      fat: item.fat_total_g,
    };

  } catch (err) {
    console.error(err);
    return null;
  }
}
