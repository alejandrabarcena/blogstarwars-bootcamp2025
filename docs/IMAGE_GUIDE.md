# 📸 Guía de Imágenes - Star Wars Blog

## 🗂️ Estructura de Carpetas

```
public/images/
├── films/           # 🎬 Películas
├── people/          # 👥 Personajes  
├── planets/         # 🌍 Planetas
├── species/         # ⚡ Especies
├── starships/       # 🚀 Naves Estelares
├── transports/      # 🚛 Transportes
└── vehicles/        # 🚗 Vehículos
```

## 📋 Lista de Imágenes Necesarias

### 🎬 Films (public/images/films/)
- `1.jpg` - A New Hope (Episode IV)
- `2.jpg` - The Empire Strikes Back (Episode V)  
- `3.jpg` - Return of the Jedi (Episode VI)
- `4.jpg` - The Phantom Menace (Episode I)
- `5.jpg` - Attack of the Clones (Episode II)
- `6.jpg` - Revenge of the Sith (Episode III)

### 👥 People (public/images/people/)
- `1.jpg` - Luke Skywalker
- `2.jpg` - C-3PO
- `3.jpg` - R2-D2
- `4.jpg` - Darth Vader
- `5.jpg` - Leia Organa
- `6.jpg` - Owen Lars
- `7.jpg` - Beru Whitesun lars
- `8.jpg` - R5-D4
- `9.jpg` - Biggs Darklighter
- `10.jpg` - Obi-Wan Kenobi
- ... (continúa según la API)

### 🌍 Planets (public/images/planets/)
- `1.jpg` - Tatooine
- `2.jpg` - Alderaan
- `3.jpg` - Yavin IV
- `4.jpg` - Hoth
- `5.jpg` - Dagobah
- `6.jpg` - Bespin
- `7.jpg` - Endor
- `8.jpg` - Naboo
- `9.jpg` - Coruscant
- `10.jpg` - Kamino
- ... (continúa según la API)

### 🚀 Starships (public/images/starships/)
- `2.jpg` - CR90 corvette
- `3.jpg` - Star Destroyer
- `5.jpg` - Sentinel-class landing craft
- `9.jpg` - Death Star
- `10.jpg` - Millennium Falcon
- `11.jpg` - Y-wing
- `12.jpg` - X-wing
- `13.jpg` - TIE Advanced x1
- `15.jpg` - Executor
- `17.jpg` - Rebel transport
- ... (continúa según la API)

### 🚗 Vehicles (public/images/vehicles/)
- `4.jpg` - Sand Crawler
- `6.jpg` - T-16 skyhopper
- `7.jpg` - X-34 landspeeder
- `8.jpg` - TIE/LN starfighter
- `14.jpg` - Snowspeeder
- `16.jpg` - TIE bomber
- `18.jpg` - AT-AT
- `19.jpg` - AT-ST
- `20.jpg` - Storm IV Twin-Pod cloud car
- ... (continúa según la API)

## 📏 Especificaciones Técnicas

### Formato Recomendado
- **Formato**: JPG (mejor compresión para fotos)
- **Resolución**: 400x250px mínimo (se ajusta automáticamente)
- **Calidad**: 80-90% (balance entre calidad y tamaño)
- **Tamaño máximo**: 500KB por imagen

### Nombres de Archivo
- **Solo números**: `1.jpg`, `2.jpg`, `3.jpg`, etc.
- **Sin espacios ni caracteres especiales**
- **Extensión en minúsculas**: `.jpg` (no `.JPG`)

## 🔄 Sistema de Fallback

El sistema busca imágenes en este orden:
1. **Local**: `/public/images/{type}/{id}.jpg`
2. **Visual Guide**: API externa
3. **SWAPI Gallery**: API externa  
4. **Wikia**: API externa
5. **Placeholder**: Imagen generada automáticamente

## 🚀 Cómo Subir Imágenes

1. **Descarga/obtén** las imágenes de Star Wars
2. **Renombra** según el ID de la API (1.jpg, 2.jpg, etc.)
3. **Coloca** en la carpeta correspondiente
4. **¡Listo!** Se mostrarán automáticamente

## 💡 Consejos

- **Prioriza personajes principales** (Luke, Leia, Vader, etc.)
- **Planetas icónicos** (Tatooine, Hoth, Endor, etc.)
- **Naves famosas** (Millennium Falcon, X-wing, etc.)
- **Usa imágenes oficiales** de alta calidad
- **Mantén consistencia** en estilo y calidad

## 🔍 Verificar IDs

Para saber qué ID corresponde a cada entidad:
1. Ve a la página de detalles del elemento
2. Mira la URL: `/details/{type}/{id}`
3. Ese `{id}` es el nombre del archivo de imagen

---

**¡Cuando tengas las imágenes, solo súbelas y se verán automáticamente!** 🎉
