// 404 Not Found middleware
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      characters: '/api/v1/characters',
      planets: '/api/v1/planets',
      starships: '/api/v1/starships',
      vehicles: '/api/v1/vehicles',
      favorites: '/api/v1/favorites'
    }
  });
};