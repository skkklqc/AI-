function jaccardSimilarity(a = [], b = []) {
  const setA = new Set(a.map(String));
  const setB = new Set(b.map(String));
  const intersection = [...setA].filter((item) => setB.has(item)).length;
  const union = new Set([...setA, ...setB]).size || 1;
  return intersection / union;
}

function getUserPreferenceVector(user) {
  return [
    ...(user.courses || []),
    ...(user.interests || []),
    ...(user.behavior?.searchedKeywords || [])
  ];
}

export function scoreBookForUser(user, book, similarUsers = []) {
  const profile = getUserPreferenceVector(user);
  const bookFeatures = [book.courseName, book.category, ...(book.tags || [])].filter(Boolean);
  const contentScore = jaccardSimilarity(profile, bookFeatures);

  const collaborativeScore = similarUsers.reduce((score, similarUser) => {
    const purchased = similarUser.behavior?.purchasedBookIds || [];
    const viewed = similarUser.behavior?.viewedBookIds || [];
    const hasBought = purchased.some((id) => String(id) === String(book._id));
    const hasViewed = viewed.some((id) => String(id) === String(book._id));
    return score + (hasBought ? 1 : 0) + (hasViewed ? 0.4 : 0);
  }, 0);

  return contentScore * 0.7 + collaborativeScore * 0.3;
}

export function findSimilarUsers(targetUser, users = []) {
  const targetVector = getUserPreferenceVector(targetUser);

  return users
    .filter((user) => String(user._id) !== String(targetUser._id))
    .map((user) => ({
      user,
      similarity: jaccardSimilarity(targetVector, getUserPreferenceVector(user))
    }))
    .filter((item) => item.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 10)
    .map((item) => item.user);
}
