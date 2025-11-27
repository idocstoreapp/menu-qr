import { useState, useEffect } from 'react';

interface MenuItem {
  id?: number;
  name: string;
  description?: string;
  price: number;
  categoryId?: number;
  imageUrl?: string;
  videoUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  order: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface MenuItemFormProps {
  item?: MenuItem;
  categories: Category[];
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
}

export default function MenuItemForm({ item, categories, onSave, onCancel }: MenuItemFormProps) {
  const [formData, setFormData] = useState<MenuItem>({
    name: '',
    description: '',
    price: 0,
    categoryId: undefined,
    imageUrl: '',
    videoUrl: '',
    isAvailable: true,
    isFeatured: false,
    order: 0,
    ...item,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-arabic-dark p-6 rounded-lg">
      <div>
        <label className="block text-gold-400 mb-2">Nombre *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 bg-arabic-brown text-cream rounded border border-gold-600 focus:border-gold-400 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-gold-400 mb-2">Descripción</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 bg-arabic-brown text-cream rounded border border-gold-600 focus:border-gold-400 focus:outline-none"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gold-400 mb-2">Precio (CLP) *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 bg-arabic-brown text-cream rounded border border-gold-600 focus:border-gold-400 focus:outline-none"
            required
            min="0"
            step="100"
          />
        </div>

        <div>
          <label className="block text-gold-400 mb-2">Categoría</label>
          <select
            value={formData.categoryId || ''}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value ? parseInt(e.target.value) : undefined })}
            className="w-full px-4 py-2 bg-arabic-brown text-cream rounded border border-gold-600 focus:border-gold-400 focus:outline-none"
          >
            <option value="">Sin categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gold-400 mb-2">URL de Imagen</label>
          <input
            type="url"
            value={formData.imageUrl || ''}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-4 py-2 bg-arabic-brown text-cream rounded border border-gold-600 focus:border-gold-400 focus:outline-none"
            placeholder="https://..."
          />
          <p className="text-beige text-xs mt-1">Se mostrará si no hay video</p>
        </div>

        <div>
          <label className="block text-gold-400 mb-2">URL de Video (3 seg)</label>
          <input
            type="url"
            value={formData.videoUrl || ''}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="w-full px-4 py-2 bg-arabic-brown text-cream rounded border border-gold-600 focus:border-gold-400 focus:outline-none"
            placeholder="https://..."
          />
          <p className="text-beige text-xs mt-1">Video corto (prioridad sobre imagen)</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-gold-400 mb-2">Orden</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 bg-arabic-brown text-cream rounded border border-gold-600 focus:border-gold-400 focus:outline-none"
            min="0"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="mr-2 w-5 h-5 text-gold-600 rounded focus:ring-gold-500"
            />
            <span className="text-gold-400">Disponible</span>
          </label>
        </div>

        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="mr-2 w-5 h-5 text-gold-600 rounded focus:ring-gold-500"
            />
            <span className="text-gold-400">Destacado</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-gold-600 hover:bg-gold-500 text-arabic-dark font-bold py-2 px-4 rounded transition"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-600 hover:bg-gray-500 text-cream font-bold py-2 px-4 rounded transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}




