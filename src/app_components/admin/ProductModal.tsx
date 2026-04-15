import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { SmallXIcon } from './ui-icons/SmallXIcon';

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
    onSave: (productData: Omit<Product, 'id'> | Product, images: File[]) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [moq, setMoq] = useState(1);
    const [stockType, setStockType] = useState<'bulk' | 'semi-bulk'>('semi-bulk');
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setMoq(product.moq || 1);
            setStockType(product.stockType || 'semi-bulk');
            setExistingImageUrls(product.imageUrls);
            setNewImageFiles([]);
        } else {
            // Reset for "Add New"
            setName('');
            setPrice(0);
            setDescription('');
            setMoq(1);
            setStockType('semi-bulk');
            setExistingImageUrls([]);
            setNewImageFiles([]);
        }
    }, [product]);

    const handleFileChange = (files: FileList | null) => {
        if (!files) return;
        setNewImageFiles(prev => [...prev, ...Array.from(files)]);
    };
    
    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };

    const removeExistingImage = (indexToRemove: number) => {
        setExistingImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    };
    
    const removeNewImage = (indexToRemove: number) => {
        setNewImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (existingImageUrls.length === 0 && newImageFiles.length === 0) {
            alert('Please upload at least one image.');
            return;
        }
        
        const productData = { 
            name, 
            price: Number(price), 
            description, 
            moq: Number(moq),
            stockType,
            imageUrls: existingImageUrls // Pass only existing URLs, new ones will be handled separately
        };

        if (product) {
            onSave({ ...productData, id: product.id }, newImageFiles);
        } else {
            onSave(productData, newImageFiles);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 max-h-[85vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{product ? 'Edit Product' : 'Add New Product'}</h2>
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">Product Name</label>
                                <input type="text" id="product-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <div>
                                <label htmlFor="product-price" className="block text-sm font-medium text-gray-700">Price (৳)</label>
                                <input type="number" id="product-price" value={price} onChange={e => setPrice(Number(e.target.value))} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="product-moq" className="block text-sm font-medium text-gray-700">MOQ (Units)</label>
                                    <input type="number" id="product-moq" value={moq} onChange={e => setMoq(Number(e.target.value))} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                                </div>
                                <div>
                                    <label htmlFor="product-stock-type" className="block text-sm font-medium text-gray-700">Stock Type</label>
                                    <select id="product-stock-type" value={stockType} onChange={e => setStockType(e.target.value as 'bulk' | 'semi-bulk')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white">
                                        <option value="bulk">Bulk</option>
                                        <option value="semi-bulk">Semi-Bulk</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="product-description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea id="product-description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Product Images</label>
                                <label 
                                    htmlFor="product-images"
                                    onDragEnter={handleDragEnter}
                                    onDragOver={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : ''}`}
                                >
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <div className="flex text-sm text-gray-600">
                                            <p className="pl-1">Upload files or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                                    </div>
                                </label>
                                <input id="product-images" name="images" type="file" multiple accept="image/*" className="sr-only" onChange={e => handleFileChange(e.target.files)} />
                                
                                {(existingImageUrls.length > 0 || newImageFiles.length > 0) && (
                                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                        {existingImageUrls.map((url, index) => (
                                            <div key={url} className="relative group">
                                                <img src={url} alt={`Existing image ${index}`} className="h-24 w-full object-cover rounded-md" />
                                                <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove image"><SmallXIcon /></button>
                                            </div>
                                        ))}
                                        {newImageFiles.map((file, index) => (
                                            <div key={file.name + index} className="relative group">
                                                <img src={URL.createObjectURL(file)} alt={`Preview ${file.name}`} className="h-24 w-full object-cover rounded-md" />
                                                <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove image"><SmallXIcon /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none">
                            Save Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;