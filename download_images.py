"""
AI Image Downloader & Manager
Downloads and organizes AI-generated images for your portfolio website
"""

import os
import requests
from pathlib import Path
from typing import List, Dict
import json

class ImageDownloader:
    def __init__(self, base_path: str = "assets"):
        self.base_path = Path(base_path)
        self.ensure_directories()
        
    def ensure_directories(self):
        """Create necessary directory structure"""
        dirs = [
            self.base_path / "projects",
            self.base_path / "narrative",
            self.base_path / "mega",
            self.base_path / "experience",
            self.base_path / "skills"
        ]
        for directory in dirs:
            directory.mkdir(parents=True, exist_ok=True)
        print("✓ Directory structure created")
    
    def download_image(self, url: str, filepath: Path) -> bool:
        """Download a single image from URL"""
        try:
            # Add headers to mimic a browser request
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=30, stream=True)
            response.raise_for_status()
            
            # Save image
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            print(f"  ✓ Downloaded: {filepath.name}")
            return True
            
        except Exception as e:
            print(f"  ✗ Failed: {filepath.name} - {str(e)}")
            return False
    
    def download_unsplash_images(self, config: Dict[str, List]):
        """Download all images from Unsplash configuration"""
        print("\n📥 Downloading project images...")
        
        for i, project in enumerate(config.get('projects', []), 1):
            name = project['name'].lower().replace(' ', '-')
            
            # Download base image
            base_path = self.base_path / "projects" / f"{name}-base.jpg"
            self.download_image(project['base'], base_path)
            
            # Download hover image
            hover_path = self.base_path / "projects" / f"{name}-hover.jpg"
            self.download_image(project['hover'], hover_path)
        
        print("\n📥 Downloading narrative images...")
        for photo in config.get('narrative', []):
            filename = f"{photo['id']}.jpg"
            filepath = self.base_path / "narrative" / filename
            self.download_image(photo['url'], filepath)
        
        print("\n📥 Downloading mega menu images...")
        for i, url in enumerate(config.get('megaMenu', []), 1):
            filepath = self.base_path / "mega" / f"mega{i}.jpg"
            self.download_image(url, filepath)
        
        print("\n📥 Downloading experience images...")
        for i, url in enumerate(config.get('products', []), 1):
            filepath = self.base_path / "experience" / f"exp{i}.jpg"
            self.download_image(url, filepath)
        
        print("\n✅ All images downloaded!")
    
    def generate_local_config(self) -> str:
        """Generate JavaScript config using local paths"""
        config = {
            "projects": [],
            "narrative": [],
            "megaMenu": [],
            "products": []
        }
        
        # Projects
        project_dir = self.base_path / "projects"
        if project_dir.exists():
            base_images = sorted(project_dir.glob("*-base.jpg"))
            for base_img in base_images:
                name = base_img.stem.replace('-base', '').replace('-', ' ').title()
                hover_img = base_img.parent / base_img.name.replace('-base', '-hover')
                
                if hover_img.exists():
                    config['projects'].append({
                        'name': name,
                        'base': f'assets/projects/{base_img.name}',
                        'hover': f'assets/projects/{hover_img.name}'
                    })
        
        # Narrative
        narrative_dir = self.base_path / "narrative"
        if narrative_dir.exists():
            for img in sorted(narrative_dir.glob("*.jpg")):
                config['narrative'].append({
                    'id': img.stem,
                    'url': f'assets/narrative/{img.name}'
                })
        
        # Mega menu
        mega_dir = self.base_path / "mega"
        if mega_dir.exists():
            config['megaMenu'] = [
                f'assets/mega/{img.name}' 
                for img in sorted(mega_dir.glob("*.jpg"))
            ]
        
        # Experience/Products
        exp_dir = self.base_path / "experience"
        if exp_dir.exists():
            config['products'] = [
                f'assets/experience/{img.name}'
                for img in sorted(exp_dir.glob("*.jpg"))
            ]
        
        return json.dumps(config, indent=2)
    
    def update_config_file(self, local_paths: bool = False):
        """Update imageConfig.js with local paths"""
        if not local_paths:
            print("\n⚠️  Using online URLs - no config update needed")
            return
        
        config_json = self.generate_local_config()
        print("\n📝 Generated local configuration:")
        print(config_json)
        print("\n💡 Update js/imageConfig.js with these paths to use local images")


def main():
    """Main execution"""
    print("""
    ╔══════════════════════════════════════════════════╗
    ║   AI Image Downloader & Portfolio Optimizer     ║
    ║   For Siddharth Srivastav's Portfolio Website   ║
    ╚══════════════════════════════════════════════════╝
    """)
    
    print("What would you like to do?\n")
    print("1. Download all images from Unsplash URLs (recommended)")
    print("2. Create directory structure only")
    print("3. Generate local config (after manual image placement)")
    print("4. Install required dependencies\n")
    
    choice = input("Enter choice (1-4): ").strip()
    
    if choice == "4":
        print("\n📦 Installing dependencies...")
        os.system("pip install requests")
        print("✓ Dependencies installed!")
        return
    
    downloader = ImageDownloader()
    
    if choice == "1":
        # Configuration from imageConfig.js
        from_config = {
            'projects': [
                {
                    'name': 'AI Personal Assistant',
                    'base': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&q=80',
                    'hover': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop&q=80'
                },
                {
                    'name': 'Traffic Prediction',
                    'base': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop&q=80',
                    'hover': 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&h=600&fit=crop&q=80'
                },
                {
                    'name': 'MLOps Pipeline',
                    'base': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&q=80',
                    'hover': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop&q=80'
                },
                {
                    'name': 'Voice Automation',
                    'base': 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&h=600&fit=crop&q=80',
                    'hover': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=600&fit=crop&q=80'
                },
                {
                    'name': 'GenAI Systems',
                    'base': 'https://images.unsplash.com/photo-1655720844730-f4a39e31310b?w=800&h=600&fit=crop&q=80',
                    'hover': 'https://images.unsplash.com/photo-1676277791608-ac379a5a9e8c?w=800&h=600&fit=crop&q=80'
                },
                {
                    'name': 'Computer Vision',
                    'base': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop&q=80',
                    'hover': 'https://images.unsplash.com/photo-1574192324001-ee41e18ed679?w=800&h=600&fit=crop&q=80'
                }
            ],
            'narrative': [
                {'id': 'np-1', 'url': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=800&fit=crop&q=80'},
                {'id': 'np-2', 'url': 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=1200&fit=crop&q=80'},
                {'id': 'np-3', 'url': 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=1200&h=800&fit=crop&q=80'},
                {'id': 'np-4', 'url': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop&q=80'}
            ],
            'megaMenu': [
                'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop&q=80',
                'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop&q=80',
                'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&h=400&fit=crop&q=80',
                'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&q=80'
            ],
            'products': [
                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80',
                'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&q=80',
                'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop&q=80',
                'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&q=80',
                'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop&q=80'
            ]
        }
        
        print("\n⏳ Starting download... This may take a few minutes.\n")
        downloader.download_unsplash_images(from_config)
        
        print("\n" + "="*60)
        print("📁 Images saved to:")
        print(f"   {downloader.base_path.absolute()}")
        print("\n💡 Next steps:")
        print("   1. Review downloaded images")
        print("   2. Optionally replace with your own")
        print("   3. Update js/imageConfig.js to use local paths")
        print("   4. Refresh your website!")
        print("="*60)
        
    elif choice == "2":
        print("✓ Directory structure ready!")
        print("\n📁 You can now add your images to:")
        print(f"   {downloader.base_path.absolute()}")
        
    elif choice == "3":
        downloader.update_config_file(local_paths=True)
    
    else:
        print("Invalid choice!")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
