// Parallax background system for Sky Jumpers
// Creates a multi-layered background with depth effect

export interface BackgroundLayer {
  image?: HTMLImageElement;  // Optional image for the layer
  color?: string;           // Color to use if no image
  parallaxFactor: number;   // How fast this layer moves (1.0 = same as camera, 0.1 = very slow)
  y: number;                // Vertical position
  height: number;           // Height of this layer
  pattern?: CanvasPattern;  // For repeating patterns
  elements?: BackgroundElement[]; // Optional elements to draw on this layer
  initialized: boolean;     // Whether this layer is ready to render
}

export interface BackgroundElement {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  shape: 'rect' | 'circle';
  speed: number;         // Individual element movement speed
  oscillate?: boolean;   // Whether the element moves up and down
  oscillationAmount?: number; // How much it oscillates
  initialY?: number;     // Starting Y position for oscillation
  oscillationSpeed?: number; // Oscillation speed
}

// Setup background layers
export function setupBackgrounds(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  // Create array of background layers (from back to front)
  const layers: BackgroundLayer[] = [
    // Sky gradient layer (static, always visible)
    {
      color: '#87CEEB', // Light blue
      parallaxFactor: 0,
      y: 0,
      height: canvas.height,
      initialized: true,
      elements: []
    },
    
    // Distant mountains/city (moves very slowly)
    {
      color: '#4b6cb7', // Bluish purple
      parallaxFactor: 0.05,
      y: canvas.height * 0.5,
      height: canvas.height * 0.5,
      initialized: true,
      elements: generateCityscape(canvas.width * 3, canvas.height * 0.5, '#3a5795')
    },
    
    // Mid-distance hills/buildings (moves moderately)
    {
      color: '#3a5795', // Darker blue
      parallaxFactor: 0.2,
      y: canvas.height * 0.6,
      height: canvas.height * 0.4,
      initialized: true,
      elements: generateHills(canvas.width * 2, canvas.height * 0.4, '#2a4075')
    },
    
    // Clouds layer (moves at moderate speed)
    {
      parallaxFactor: 0.3,
      y: 0,
      height: canvas.height * 0.7,
      initialized: true,
      elements: generateClouds(canvas.width * 2, canvas.height * 0.7)
    },
    
    // Foreground elements (moves faster)
    {
      parallaxFactor: 0.7,
      y: canvas.height * 0.8,
      height: canvas.height * 0.2,
      initialized: true,
      elements: generateForegroundElements(canvas.width * 2, canvas.height * 0.2)
    }
  ];
  
  let lastTime = 0;
  
  // Render all background layers with parallax effect
  function renderBackgrounds(cameraX: number, cameraY: number, deltaTime: number) {
    if (!lastTime) lastTime = deltaTime;
    const dt = (deltaTime - lastTime) / 16.67;
    lastTime = deltaTime;
    
    // Draw each layer
    layers.forEach(layer => {
      // Calculate parallax offset based on camera position
      const parallaxX = cameraX * layer.parallaxFactor;
      const parallaxY = cameraY * (layer.parallaxFactor * 0.5); // Vertical parallax is more subtle
      
      // Draw base layer
      ctx.save();
      
      if (layer.color) {
        ctx.fillStyle = layer.color;
        // Fill the entire width plus some extra to ensure coverage during movement
        const extraWidth = canvas.width * 2;
        ctx.fillRect(
          parallaxX, 
          layer.y - parallaxY, 
          canvas.width + extraWidth, 
          layer.height
        );
      }
      
      // Draw elements on this layer
      if (layer.elements && layer.elements.length > 0) {
        layer.elements.forEach(element => {
          // Update element position if it has individual movement
          if (element.speed) {
            element.x -= element.speed * dt;
            
            // If element goes off screen, move it back to right side
            if (element.x + element.width < parallaxX - canvas.width) {
              element.x = parallaxX + canvas.width * 2 + Math.random() * canvas.width;
            }
          }
          
          // Handle oscillation if enabled
          if (element.oscillate && element.initialY !== undefined && 
              element.oscillationAmount && element.oscillationSpeed) {
            element.y = element.initialY + 
              Math.sin(Date.now() * element.oscillationSpeed) * element.oscillationAmount;
          }
          
          // Only draw if in viewport or close to it
          if (element.x + element.width >= parallaxX - canvas.width && 
              element.x <= parallaxX + canvas.width * 2) {
              
            ctx.fillStyle = element.color;
            
            if (element.shape === 'rect') {
              ctx.fillRect(
                element.x - parallaxX,
                element.y,
                element.width,
                element.height
              );
            } else if (element.shape === 'circle') {
              ctx.beginPath();
              ctx.arc(
                element.x - parallaxX + element.width/2,
                element.y + element.height/2,
                element.width/2,
                0,
                Math.PI * 2
              );
              ctx.fill();
            }
          }
        });
      }
      
      ctx.restore();
    });
  }
  
  // Generate a stylized cityscape
  function generateCityscape(width: number, height: number, color: string): BackgroundElement[] {
    const elements: BackgroundElement[] = [];
    const buildingCount = Math.floor(width / 100);
    
    for (let i = 0; i < buildingCount; i++) {
      const buildingWidth = 50 + Math.random() * 80;
      const buildingHeight = 50 + Math.random() * (height * 0.8);
      const x = i * 100 + Math.random() * 50;
      
      elements.push({
        x,
        y: height - buildingHeight,
        width: buildingWidth,
        height: buildingHeight,
        color,
        shape: 'rect',
        speed: 0 // Static
      });
    }
    
    return elements;
  }
  
  // Generate rolling hills
  function generateHills(width: number, height: number, color: string): BackgroundElement[] {
    const elements: BackgroundElement[] = [];
    const hillCount = Math.floor(width / 200);
    
    for (let i = 0; i < hillCount; i++) {
      const hillWidth = 200 + Math.random() * 300;
      const hillHeight = 50 + Math.random() * (height * 0.7);
      const x = i * 200 + Math.random() * 100;
      
      elements.push({
        x,
        y: height - hillHeight,
        width: hillWidth,
        height: hillHeight,
        color,
        shape: 'rect',
        speed: 0 // Static
      });
    }
    
    return elements;
  }
  
  // Generate clouds
  function generateClouds(width: number, height: number): BackgroundElement[] {
    const elements: BackgroundElement[] = [];
    const cloudCount = 15;
    
    for (let i = 0; i < cloudCount; i++) {
      const size = 30 + Math.random() * 80;
      const x = Math.random() * width;
      const y = Math.random() * (height * 0.8);
      const speed = 0.2 + Math.random() * 0.5; // Clouds move slowly to the left
      const shade = Math.floor(240 + Math.random() * 15);
      const color = `rgb(${shade}, ${shade}, ${shade})`;
      
      elements.push({
        x,
        y,
        width: size,
        height: size / 2,
        color,
        shape: 'circle',
        speed,
        oscillate: true,
        oscillationAmount: 5,
        initialY: y,
        oscillationSpeed: 0.0005 + Math.random() * 0.0005
      });
    }
    
    return elements;
  }
  
  // Generate foreground elements like small bushes or ground details
  function generateForegroundElements(width: number, height: number): BackgroundElement[] {
    const elements: BackgroundElement[] = [];
    const elementCount = Math.floor(width / 50);
    
    for (let i = 0; i < elementCount; i++) {
      const size = 5 + Math.random() * 15;
      const x = Math.random() * width;
      const y = height - size - Math.random() * 10;
      
      elements.push({
        x,
        y,
        width: size,
        height: size,
        color: '#1a3055', // Dark color for foreground elements
        shape: 'rect',
        speed: 0 // Static
      });
    }
    
    return elements;
  }
  
  return {
    renderBackgrounds,
    layers
  };
} 