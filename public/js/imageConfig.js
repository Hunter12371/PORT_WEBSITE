/* ===================================================================
   IMAGE CONFIGURATION & AI IMAGE INTEGRATION
   Centralized image management with AI-generated placeholders
   =================================================================== */

const ImageConfig = {
  // AI Image Generation APIs
  apis: {
    // Unsplash for high-quality photos
    unsplash: (width, height, query) => 
      `https://source.unsplash.com/${width}x${height}/?${query}`,
    
    // Picsum for reliable placeholders
    picsum: (width, height, id) => 
      `https://picsum.photos/${width}/${height}?random=${id}`,
    
    // AI Art generator (using placeholder for AI-generated style)
    aiArt: (width, height, seed) => 
      `https://picsum.photos/seed/${seed}/${width}/${height}`,
  },

  // Project/Helmet Images - AI Generated themes
  projects: [
    {
      id: 1,
      name: 'AI Personal Assistant',
      base: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&q=80', // AI/Robot
      hover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop&q=80', // Tech
      query: 'artificial-intelligence,robot,technology'
    },
    {
      id: 2,
      name: 'Traffic Prediction',
      base: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop&q=80', // Traffic
      hover: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&h=600&fit=crop&q=80', // City
      query: 'traffic,city,data-visualization'
    },
    {
      id: 3,
      name: 'MLOps Pipeline',
      base: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&q=80', // Servers
      hover: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop&q=80', // Code
      query: 'server,cloud,devops'
    },
    {
      id: 4,
      name: 'Voice Automation',
      base: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&h=600&fit=crop&q=80', // Microphone
      hover: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=600&fit=crop&q=80', // Sound waves
      query: 'microphone,voice,audio'
    },
    {
      id: 5,
      name: 'GenAI Systems',
      base: 'https://images.unsplash.com/photo-1655720844730-f4a39e31310b?w=800&h=600&fit=crop&q=80', // AI Brain
      hover: 'https://images.unsplash.com/photo-1676277791608-ac379a5a9e8c?w=800&h=600&fit=crop&q=80', // Neural
      query: 'neural-network,ai,generative'
    },
    {
      id: 6,
      name: 'Computer Vision',
      base: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop&q=80', // Eye/Vision
      hover: 'https://images.unsplash.com/photo-1574192324001-ee41e18ed679?w=800&h=600&fit=crop&q=80', // Camera
      query: 'computer-vision,camera,detection'
    }
  ],

  // Narrative/Journey Photos - AI themes
  narrative: [
    {
      id: 'np-1',
      url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=800&fit=crop&q=80', // Deep Learning
      caption: 'Deep Learning, 2022'
    },
    {
      id: 'np-2',
      url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=1200&fit=crop&q=80', // NLP/Text
      caption: 'NLP & LLMs, 2023'
    },
    {
      id: 'np-3',
      url: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=1200&h=800&fit=crop&q=80', // Generative AI
      caption: 'Generative AI, 2024'
    },
    {
      id: 'np-4',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop&q=80', // Production
      caption: 'Production AI, 2025'
    }
  ],

  // Mega Menu Photos - Tech/AI themed
  megaMenu: [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop&q=80', // Tech workspace
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&q=80', // Technology
    'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&h=400&fit=crop&q=80', // Code
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&q=80'  // AI/Robot
  ],

  // Work Experience/Products - Tech companies
  products: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80', // Office/Startup
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80', // Corporate
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop&q=80', // Team
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&q=80', // Tech work
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop&q=80'  // Workspace
  ],

  // Partnership/Skills logos (abstract tech patterns)
  partnerships: [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=400&fit=crop&q=80'
  ],

  // Lazy loading configuration
  lazyLoad: {
    rootMargin: '50px',
    threshold: 0.01
  },

  // Initialize all images
  init() {
    this.loadProjectImages();
    this.loadNarrativeImages();
    this.loadMegaMenuImages();
    this.loadProductImages();
    this.loadPartnershipImages();
    this.setupLazyLoading();
  },

  // Load project/helmet images
  loadProjectImages() {
    this.projects.forEach((project, index) => {
      const card = document.querySelector(`.himg-${index + 1}`);
      const cardAlt = document.querySelector(`.himg-${index + 1}-alt`);
      
      if (card) {
        card.setAttribute('data-src', project.base);
        card.setAttribute('data-fallback', this.apis.aiArt(800, 600, `project-${index + 1}-base`));
      }
      if (cardAlt) {
        cardAlt.setAttribute('data-src', project.hover);
        cardAlt.setAttribute('data-fallback', this.apis.aiArt(800, 600, `project-${index + 1}-hover`));
      }
    });
  },

  // Load narrative photos
  loadNarrativeImages() {
    this.narrative.forEach(photo => {
      const el = document.querySelector(`.${photo.id}`);
      if (el) {
        el.setAttribute('data-src', photo.url);
        el.setAttribute('data-fallback', this.apis.aiArt(1200, 800, `narrative-${photo.id}`));
      }
    });
  },

  // Load mega menu images
  loadMegaMenuImages() {
    this.megaMenu.forEach((url, index) => {
      const el = document.querySelector(`.mphoto-${index + 1}`);
      if (el) {
        el.setAttribute('data-src', url);
        el.setAttribute('data-fallback', this.apis.aiArt(600, 400, `mega-${index + 1}`));
      }
    });
  },

  // Load product/experience images
  loadProductImages() {
    this.products.forEach((url, index) => {
      const el = document.querySelector(`.prod-${index + 1}`);
      if (el) {
        el.setAttribute('data-src', url);
        el.setAttribute('data-fallback', this.apis.aiArt(800, 600, `product-${index + 1}`));
      }
    });
  },

  // Load partnership images
  loadPartnershipImages() {
    this.partnerships.forEach((url, index) => {
      const el = document.querySelector(`.partner-logo-${index + 1}`);
      if (el) {
        el.setAttribute('data-src', url);
        el.setAttribute('data-fallback', this.apis.aiArt(400, 400, `partner-${index + 1}`));
      }
    });
  },

  // Setup intersection observer for lazy loading
  setupLazyLoading() {
    const lazyImages = document.querySelectorAll('[data-src]');
    
    if (!lazyImages.length) {
      console.log('No lazy-load images found');
      return;
    }
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            
            if (src && !img.classList.contains('loaded')) {
              // Preload image
              const tempImg = new Image();
              tempImg.onload = () => {
                img.style.backgroundImage = `url('${src}')`;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
                
                // Refresh ScrollTrigger if GSAP is loaded
                if (typeof ScrollTrigger !== 'undefined') {
                  setTimeout(() => ScrollTrigger.refresh(), 100);
                }
              };
              tempImg.onerror = () => {
                const fallbackSrc = img.getAttribute('data-fallback') || this.apis.aiArt(800, 600, 'default-fallback');
                const fallbackImg = new Image();
                fallbackImg.onload = () => {
                  img.style.backgroundImage = `url('${fallbackSrc}')`;
                  img.classList.add('loaded');
                  img.classList.add('fallback-loaded');
                  img.removeAttribute('data-src');
                };
                fallbackImg.onerror = () => {
                  console.warn('Failed to load both primary and fallback image:', src);
                  img.classList.add('error');
                  img.classList.add('loaded');
                };
                fallbackImg.src = fallbackSrc;
              };
              tempImg.src = src;
            }
            
            observer.unobserve(img);
          }
        });
      }, this.lazyLoad);

      lazyImages.forEach(img => imageObserver.observe(img));
      console.log('Lazy loading initialized for', lazyImages.length, 'images');
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
          img.style.backgroundImage = `url('${src}')`;
          img.classList.add('loaded');
        }
      });
    }
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all scripts are loaded
    setTimeout(() => ImageConfig.init(), 100);
  });
} else {
  // DOM already loaded
  setTimeout(() => ImageConfig.init(), 100);
}
