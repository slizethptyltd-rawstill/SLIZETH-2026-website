import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, X, Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { jsPDF } from 'jspdf';
import { GoogleGenAI } from '@google/genai';

export default function Tools() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [autoCrop, setAutoCrop] = useState(false);
  const [alignPages, setAlignPages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track active preview URLs to revoke on unmount
  const previewsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('Gemini API key not found. AI features will be disabled.');
    }
  }, []);
  
  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsAdding(true);
      const newFiles = Array.from(e.target.files) as File[];
      
      // To better simulate loading, process files with a short delay
      setTimeout(() => {
        setImages(prev => [...prev, ...newFiles]);
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
        setIsAdding(false);
      }, 500); // Simulate network/processing delay
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const previewItems = Array.from(previews);
    const [reorderedPreview] = previewItems.splice(result.source.index, 1);
    previewItems.splice(result.destination.index, 0, reorderedPreview);

    setImages(items);
    setPreviews(previewItems);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      // Revoke the URL to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: {
        data: await base64EncodedDataPromise,
        mimeType: file.type,
      },
    };
  };

  const processImageWithAI = async (imageFile: File): Promise<string> => {
    if (!process.env.GEMINI_API_KEY) {
      alert('Gemini API key is not configured.');
      throw new Error('Gemini API key not found.');
    }

    const model = 'gemini-flash-latest';
    const imagePart = await fileToGenerativePart(imageFile);

    let prompt = 'Analyze the image.';
    if (autoCrop && alignPages) {
      prompt = 'Autocrop and align the document in the image. Return only the processed image.';
    } else if (autoCrop) {
      prompt = 'Autocrop the document in the image. Return only the processed image.';
    } else if (alignPages) {
      prompt = 'Align the document in the image. Return only the processed image.';
    }

    const result = await ai.models.generateContent({ model, contents: { parts: [imagePart, { text: prompt }] } });
    // Assuming the API returns the processed image data in a specific format.
    // This part might need adjustment based on the actual API response structure.
    const processedImagePart = result.candidates?.[0].content.parts.find(part => part.inlineData);
    if (processedImagePart && processedImagePart.inlineData) {
      return `data:${processedImagePart.inlineData.mimeType};base64,${processedImagePart.inlineData.data}`;
    }
    
    // Fallback to original image if AI processing fails
    return URL.createObjectURL(imageFile);
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setIsConverting(true);

    try {
      const doc = new jsPDF();
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        let imageUrl = previews[i];

        if (autoCrop || alignPages) {
          try {
            imageUrl = await processImageWithAI(image);
          } catch (error) {
            console.error(`AI processing failed for image ${i}:`, error);
            // Optionally, notify the user that AI processing failed for this image
          }
        }
        
        // Create an image element to get dimensions
        const img = new Image();
        img.src = imageUrl;
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Calculate dimensions to fit A4
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        
        const maxW = pageWidth - (margin * 2);
        const maxH = pageHeight - (margin * 2);
        
        let w = img.width;
        let h = img.height;
        
        // Scale down if needed
        if (w > maxW) {
          h = (maxW / w) * h;
          w = maxW;
        }
        if (h > maxH) {
          w = (maxH / h) * w;
          h = maxH;
        }
        
        // Center image
        const x = (pageWidth - w) / 2;
        const y = (pageHeight - h) / 2;

        if (i > 0) doc.addPage();
        doc.addImage(img, 'JPEG', x, y, w, h);
      }

      doc.save('slizeth-converted.pdf');
    } catch (error) {
      console.error("Conversion failed", error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <section id="tools" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-3">Professional Tools</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6">
            Experience Our Capability
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Try our secure, client-side Image to PDF converter. Your data never leaves your browser.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Image to PDF Converter</h4>
                    <p className="text-xs text-slate-500">Client-side processing • No uploads</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <input id="autocrop" type="checkbox" checked={autoCrop} onChange={(e) => setAutoCrop(e.target.checked)} disabled={!process.env.GEMINI_API_KEY} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 disabled:cursor-not-allowed disabled:text-gray-400" />
                    <label htmlFor="autocrop" className="ml-2 block text-sm text-slate-700">Auto-crop</label>
                  </div>
                  <div className="flex items-center">
                    <input id="align" type="checkbox" checked={alignPages} onChange={(e) => setAlignPages(e.target.checked)} disabled={!process.env.GEMINI_API_KEY} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 disabled:cursor-not-allowed disabled:text-gray-400" />
                    <label htmlFor="align" className="ml-2 block text-sm text-slate-700">Align Pages</label>
                  </div>
                  </div>
                  {!process.env.GEMINI_API_KEY && (
                    <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200 mt-4">
                      AI features are disabled. Please configure your Gemini API key to enable them.
                    </div>
                  )}
                {images.length > 0 && (
                  <button 
                    onClick={() => {
                      setImages([]);
                      setPreviews([]);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="p-8">
              {images.length === 0 ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/30 transition-all group"
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-teal-600 group-hover:scale-110 transition-all">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h5 className="text-lg font-medium text-slate-900 mb-2">Drop images here or click to upload</h5>
                  <p className="text-slate-500 text-sm">Supports JPG, PNG, WEBP</p>
                </div>
              ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="previews" direction="horizontal">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                        {previews.map((url, idx) => (
                          <Draggable key={url} draggableId={url} index={idx}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <div className="relative group aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                  <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                  <button 
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-2 right-2 p-1 bg-white/90 text-slate-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-[10px] rounded backdrop-blur-sm">
                                    Page {idx + 1}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {isAdding && [...Array(3)].map((_, i) => (
                          <div key={`loader-${i}`} className="aspect-[3/4] rounded-lg bg-slate-100 animate-pulse"></div>
                        ))}
                        <div 
                          onClick={() => !isAdding && fileInputRef.current?.click()}
                          className={`aspect-[3/4] rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center transition-all text-slate-400 ${isAdding ? 'cursor-not-allowed bg-slate-50' : 'cursor-pointer hover:border-teal-500 hover:bg-teal-50/30 hover:text-teal-600'}`}
                        >
                          {isAdding ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : (
                            <>
                              <Upload className="w-6 h-6 mb-2" />
                              <span className="text-xs font-medium">Add Page</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple 
                accept="image/*" 
              />

              <div className="mt-8 flex justify-end">
                <button
                  onClick={convertToPdf}
                  disabled={images.length === 0 || isConverting}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    images.length === 0 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
