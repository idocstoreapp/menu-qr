import { useState, useEffect } from 'react';

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId?: number;
}

interface MenuItemFormProps {
  item: MenuItem;
  onSave: (id: number, price: number) => void;
  onCancel: () => void;
}

export default function MenuItemForm({ item, onSave, onCancel }: MenuItemFormProps) {
  const [price, setPrice] = useState<number>(item.price);

  useEffect(() => {
    setPrice(item.price);
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item.id, price);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-arabic-dark p-6 rounded-lg border border-gold-600">
      <div className="mb-4">
        <h3 className="text-gold-400 font-bold text-xl mb-2">{item.name}</h3>
        {item.description && (
          <p className="text-gold-200 text-sm mb-4">{item.description}</p>
        )}
        <p className="text-beige text-xs">
          ⚠️ Los items del menú son estáticos. Solo puedes editar el precio.
        </p>
      </div>

      <div>
        <label className="block text-gold-400 mb-2 font-semibold">
          Precio (CLP) *
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          className="w-full px-4 py-3 bg-arabic-brown text-cream rounded border-2 border-gold-600 focus:border-gold-400 focus:outline-none text-lg font-bold"
          required
          min="0"
          step="100"
        />
        <p className="text-gold-300 text-sm mt-2">
          Precio actual: <span className="font-bold">{formatPrice(item.price)}</span>
        </p>
        {price !== item.price && (
          <p className="text-gold-400 text-sm mt-1">
            Nuevo precio: <span className="font-bold">{formatPrice(price)}</span>
          </p>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-gold-600 hover:bg-gold-500 text-arabic-dark font-bold py-3 px-6 rounded transition"
        >
          Guardar Precio
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-600 hover:bg-gray-500 text-cream font-bold py-3 px-6 rounded transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
