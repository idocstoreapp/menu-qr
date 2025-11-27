import { useState, useEffect } from 'react';
import MenuItemList from './MenuItemList';
import MenuItemForm from './MenuItemForm';

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminMenuManager() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setView('form');
  };

  const handleSave = async (item: any) => {
    try {
      const method = item.id ? 'PUT' : 'POST';
      
      // Asegurar que el ID sea un número si existe
      const payload = {
        ...item,
        id: item.id ? parseInt(item.id) : undefined,
        categoryId: item.categoryId ? parseInt(item.categoryId) : (item.categoryId === '' ? null : undefined),
        price: parseFloat(item.price) || 0,
        order: parseInt(item.order) || 0,
      };

      const response = await fetch('/api/menu-items', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setView('list');
        setEditingItem(null);
        // Recargar la página para actualizar la lista
        window.location.reload();
      } else {
        const error = await response.json();
        console.error('Error response:', error);
        alert('Error al actualizar item: ' + (error.error || 'No se pudo guardar. Revisa la consola para más detalles.'));
      }
    } catch (error: any) {
      console.error('Error saving item:', error);
      alert('Error al guardar el item: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleCancel = () => {
    setView('list');
    setEditingItem(null);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setView('form');
  };

  if (view === 'form') {
    return (
      <div>
        <button
          onClick={handleCancel}
          className="mb-4 bg-gray-600 hover:bg-gray-500 text-cream px-4 py-2 rounded transition"
        >
          ← Volver a la lista
        </button>
        <MenuItemForm
          item={editingItem}
          categories={categories}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-cinzel text-gold-400">Items del Menú</h2>
        <button
          onClick={handleAddNew}
          className="bg-gold-600 hover:bg-gold-500 text-arabic-dark font-bold py-2 px-4 rounded transition"
        >
          + Agregar Item
        </button>
      </div>
      <MenuItemList onEdit={handleEdit} onDelete={async (id) => {
        if (confirm('¿Estás seguro de eliminar este item?')) {
          const response = await fetch(`/api/menu-items?id=${id}`, { method: 'DELETE' });
          if (response.ok) {
            window.location.reload();
          }
        }
      }} />
    </div>
  );
}


