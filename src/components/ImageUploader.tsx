import React, { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from '../components/ui/use-toast';

interface ImageUploaderProps {
  onImageSelected: (imageUrl: string, alt: string, title: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [cropSettings, setCropSettings] = useState({ width: '100%', height: 'auto' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir resim dosyası seçin.",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Set default title from filename
    const fileName = file.name.split('.')[0];
    setImageTitle(fileName);
  };

  const handleInsertImage = () => {
    if (!preview) return;
    
    // In a real app, we'd upload the image to a server
    // Here we'll just use the base64 preview as our "uploaded" image URL
    onImageSelected(preview, altText, imageTitle);
    
    // Reset
    setIsOpen(false);
    setPreview(null);
    setAltText('');
    setImageTitle('');
    setCropSettings({ width: '100%', height: 'auto' });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCropChange = (dimension: 'width' | 'height', value: string) => {
    setCropSettings(prev => ({ ...prev, [dimension]: value }));
  };

  return (
    <>
      <Button 
        type="button" 
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="border-coffee-200 text-coffee-700"
      >
        Görsel Ekle
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Görsel Ekle</DialogTitle>
            <DialogDescription>
              Makalenize eklemek için bir görsel seçin ve düzenleyin.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {!preview ? (
              <div 
                className="border-2 border-dashed border-coffee-200 rounded-lg p-12 text-center cursor-pointer hover:bg-coffee-50"
                onClick={triggerFileInput}
              >
                <p className="text-coffee-600">
                  Görsel seçmek için tıklayın veya sürükleyin
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-auto max-h-[300px] flex justify-center bg-coffee-50 rounded-md p-2">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="object-contain"
                    style={{
                      width: cropSettings.width,
                      height: cropSettings.height,
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-coffee-700 block mb-1">
                      Genişlik
                    </label>
                    <select 
                      value={cropSettings.width} 
                      onChange={(e) => handleCropChange('width', e.target.value)}
                      className="w-full border rounded-md border-coffee-200 p-2"
                    >
                      <option value="100%">Tam Genişlik (100%)</option>
                      <option value="75%">75%</option>
                      <option value="50%">50%</option>
                      <option value="25%">25%</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-coffee-700 block mb-1">
                      Yükseklik
                    </label>
                    <select 
                      value={cropSettings.height} 
                      onChange={(e) => handleCropChange('height', e.target.value)}
                      className="w-full border rounded-md border-coffee-200 p-2"
                    >
                      <option value="auto">Otomatik</option>
                      <option value="200px">200px</option>
                      <option value="300px">300px</option>
                      <option value="400px">400px</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-coffee-700 block mb-1">
                    Alternatif Metin (SEO için)
                  </label>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Görselin açıklaması"
                    className="w-full border rounded-md border-coffee-200 p-2"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-coffee-700 block mb-1">
                    Görsel Başlığı
                  </label>
                  <input
                    type="text"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                    placeholder="Görselin başlığı"
                    className="w-full border rounded-md border-coffee-200 p-2"
                  />
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setPreview(null);
                    }}
                    className="border-coffee-200"
                  >
                    Sıfırla
                  </Button>
                  
                  <Button 
                    type="button" 
                    onClick={handleInsertImage}
                    className="bg-coffee-700 hover:bg-coffee-800"
                  >
                    Görseli Ekle
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageUploader;
