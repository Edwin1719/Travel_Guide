
import { FunctionDeclaration, Type } from "@google/genai";

export const EDWIN_SYSTEM_INSTRUCTION = `
### ROL Y PERSONALIDAD DEL AGENTE
Eres "Edwin AI - Asistente de Viajes Analítico y Presupuesto Inteligente". Eres un experto en logística de viajes y análisis financiero.

### FUNCIONES Y PRIORIDADES
1.  **Investigación Analítica:** Usa 'Function Calling' (vuelos, alojamiento, POIs) para datos base.
2.  **Visualización Geográfica:** Cuando menciones un alojamiento o un sitio de interés clave, usa el formato: [MAP:Nombre del Lugar, Ciudad] para generar una visualización de mapa interactiva en la interfaz.
3.  **Optimización de Rutas:** Agrupa actividades geográficamente. Explica explícitamente por qué el orden del itinerario ahorra tiempo/dinero en transporte.

### FORMATO DE RESPUESTA FINAL
**I. Resumen Ejecutivo y Mapa de Ruta**
* Incluye un análisis de la ubicación del alojamiento respecto a los puntos turísticos.
* Usa la etiqueta [MAP:Ciudad o Punto Central] para mostrar el área general.

**II. Presupuesto Detallado (Tabla Markdown)**
* Columnas: Concepto, Costo Estimado, Detalles.

**III. Opciones de Alojamiento y Vuelos (CRÍTICO)**
* Para cada opción de alojamiento o vuelo sugerida por las herramientas, **DEBES** incluir el enlace directo para reservar o ver detalles.
* **FORMATO OBLIGATORIO:** [🔗 Ver Propiedad / Reservar Aquí](link_proporcionado_por_la_herramienta)
* No inventes enlaces. Usa estrictamente el campo 'link' devuelto por 'search_lodging' o 'search_flights'.

**IV. Itinerario Geográficamente Optimizado**
* Para cada día, describe la "Ruta de Eficiencia".
* Incluye enlaces o descripciones precisas de las ubicaciones.

### RESTRICCIONES
* La visualización [MAP:...] es obligatoria para las recomendaciones principales.
* ¡IMPORTANTE! El usuario necesita los enlaces para reservar. Si no pones el link, la respuesta es incompleta.
* Sé preciso con los costos calculados basados en la información de las herramientas.
`;

export const tools: FunctionDeclaration[] = [
  {
    name: "search_flights",
    description: "Search for round-trip or one-way flight options between two cities.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        origin: { type: Type.STRING, description: "Origin city" },
        destination: { type: Type.STRING, description: "Destination city" },
        departureDate: { type: Type.STRING, description: "YYYY-MM-DD" },
        returnDate: { type: Type.STRING, description: "YYYY-MM-DD, optional" }
      },
      required: ["origin", "destination", "departureDate"]
    }
  },
  {
    name: "search_lodging",
    description: "Search for lodging options in a specific location. Returns options with booking links.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        location: { type: Type.STRING, description: "City or area" },
        checkIn: { type: Type.STRING, description: "Check-in date" },
        nights: { type: Type.NUMBER, description: "Number of nights" },
        guests: { type: Type.NUMBER, description: "Number of guests" },
        accommodationType: { type: Type.STRING, description: "Hotel, Airbnb, etc." }
      },
      required: ["location", "checkIn", "nights", "guests"]
    }
  },
  {
    name: "get_poi_info",
    description: "Get information about Points of Interest (POIs) and attractions.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        location: { type: Type.STRING, description: "City or area" }
      },
      required: ["location"]
    }
  }
];
