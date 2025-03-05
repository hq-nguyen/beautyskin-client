// Mock data service
const mockCategories = [
    { id: 1, name: 'Skincare' },
    { id: 2, name: 'Makeup' },
    { id: 3, name: 'Haircare' }
  ];
  
  const mockBrands = [
    { 
      id: 1, 
      name: 'Neutrogena', 
      description: 'Dermatologist recommended skincare',
      image: 'https://via.placeholder.com/50?text=N'
    },
    { 
      id: 2, 
      name: 'L\'Oreal', 
      description: 'Beauty for all',
      image: 'https://via.placeholder.com/50?text=L'
    }
  ];
  
  const mockConcerns = [
    { id: 1, name: 'Acne' },
    { id: 2, name: 'Aging' },
    { id: 3, name: 'Hydration' }
  ];
  
  const mockTextures = [
    { id: 1, name: 'Gel' },
    { id: 2, name: 'Cream' },
    { id: 3, name: 'Lightweight' }
  ];
  
  export const ProductAttributeService = {
    getCategories: () => Promise.resolve({ data: mockCategories }),
    createCategory: (data) => {
      const newCategory = { ...data, id: mockCategories.length + 1 };
      mockCategories.push(newCategory);
      return Promise.resolve(newCategory);
    },
    updateCategory: (id, data) => {
      const index = mockCategories.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCategories[index] = { ...mockCategories[index], ...data };
      }
      return Promise.resolve(mockCategories[index]);
    },
    deleteCategory: (id) => {
      const index = mockCategories.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCategories.splice(index, 1);
      }
      return Promise.resolve();
    },
  
    getBrands: () => Promise.resolve({ data: mockBrands }),
    createBrand: (data) => {
      const newBrand = { ...data, id: mockBrands.length + 1 };
      mockBrands.push(newBrand);
      return Promise.resolve(newBrand);
    },
    updateBrand: (id, data) => {
      const index = mockBrands.findIndex(b => b.id === id);
      if (index !== -1) {
        mockBrands[index] = { ...mockBrands[index], ...data };
      }
      return Promise.resolve(mockBrands[index]);
    },
    deleteBrand: (id) => {
      const index = mockBrands.findIndex(b => b.id === id);
      if (index !== -1) {
        mockBrands.splice(index, 1);
      }
      return Promise.resolve();
    },
  
    getConcerns: () => Promise.resolve({ data: mockConcerns }),
    createConcern: (data) => {
      const newConcern = { ...data, id: mockConcerns.length + 1 };
      mockConcerns.push(newConcern);
      return Promise.resolve(newConcern);
    },
    updateConcern: (id, data) => {
      const index = mockConcerns.findIndex(c => c.id === id);
      if (index !== -1) {
        mockConcerns[index] = { ...mockConcerns[index], ...data };
      }
      return Promise.resolve(mockConcerns[index]);
    },
    deleteConcern: (id) => {
      const index = mockConcerns.findIndex(c => c.id === id);
      if (index !== -1) {
        mockConcerns.splice(index, 1);
      }
      return Promise.resolve();
    },
  
    getTextures: () => Promise.resolve({ data: mockTextures }),
    createTexture: (data) => {
      const newTexture = { ...data, id: mockTextures.length + 1 };
      mockTextures.push(newTexture);
      return Promise.resolve(newTexture);
    },
    updateTexture: (id, data) => {
      const index = mockTextures.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTextures[index] = { ...mockTextures[index], ...data };
      }
      return Promise.resolve(mockTextures[index]);
    },
    deleteTexture: (id) => {
      const index = mockTextures.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTextures.splice(index, 1);
      }
      return Promise.resolve();
    }
  };