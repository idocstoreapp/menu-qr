import { useState } from 'react';
import MenuItemList from './MenuItemList';
import MenuItemForm from './MenuItemForm';

export default function AdminMenuManager() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setView('form');
  };

  const handleSave = async (id: number, price: number) => {
    try {
      const response = await fetch('/api/menu-items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, price }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('✅ Precio actualizado correctamente');
        setView('list');
        setEditingItem(null);
        // Recargar la página para actualizar la lista
        window.location.reload();
      } else {
        const error = await response.json();
        console.error('Error response:', error);
        alert('❌ Error al actualizar precio: ' + (error.error || 'No se pudo guardar.'));
      }
    } catch (error: any) {
      console.error('Error saving price:', error);
      alert('❌ Error al guardar el precio: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleCancel = () => {
    setView('list');
    setEditingItem(null);
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
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-cinzel text-gold-400 mb-2">Items del Menú</h2>
        <p className="text-gold-300 text-sm">
          ⚠️ Los items del menú son estáticos. Solo puedes editar los precios haciendo clic en "Editar".
        </p>
      </div>
      <MenuItemList 
        onEdit={handleEdit} 
        onDelete={async () => {
          alert('⚠️ No se pueden eliminar items. Los items del menú son estáticos.');
        }} 
      />
    </div>
  );
}
