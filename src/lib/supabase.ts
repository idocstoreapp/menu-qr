import { createClient } from '@supabase/supabase-js';

// Tipos para las tablas de la base de datos
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  order_num: number;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number | null;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  order_num: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

// Cliente de Supabase
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = '⚠️ ERROR: Variables de entorno de Supabase no configuradas. ' +
    'Configura PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY en tu plataforma de deploy.';
  console.error(errorMsg);
  
  // NO lanzar error durante el build, solo mostrar warning
  // El error se mostrará en runtime cuando se intente usar
}

// Crear cliente con validación
// Usar placeholder solo si no hay configuración (para evitar errores en build)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Helper para subir imágenes a Supabase Storage
export async function uploadImage(file: File, bucket: string = 'menu-images'): Promise<string | null> {
  try {
    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Subir archivo
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error subiendo imagen:', error);
      return null;
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error en uploadImage:', error);
    return null;
  }
}

// Helper para eliminar imagen de Supabase Storage
export async function deleteImage(imageUrl: string, bucket: string = 'menu-images'): Promise<boolean> {
  try {
    // Extraer el nombre del archivo de la URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      console.error('Error eliminando imagen:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error en deleteImage:', error);
    return false;
  }
}

// Funciones CRUD para Categorías
export const categoriesApi = {
  async getAll(onlyActive: boolean = false) {
    let query = supabase
      .from('categories')
      .select('*')
      .order('order_num', { ascending: true });
    
    if (onlyActive) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Category[];
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Category;
  },

  async create(category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: category.name,
        slug: category.slug || category.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: category.description || null,
        order_num: category.order_num || 0,
        is_active: category.is_active ?? true,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Category;
  },

  async update(id: number, category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        slug: category.slug,
        description: category.description,
        order_num: category.order_num,
        is_active: category.is_active,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Category;
  },

  async delete(id: number) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async toggleActive(id: number, isActive: boolean) {
    const { data, error } = await supabase
      .from('categories')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Category;
  }
};

// Funciones CRUD para Items del Menú
export const menuItemsApi = {
  async getAll(options: { categoryId?: number; availableOnly?: boolean } = {}) {
    let query = supabase
      .from('menu_items')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .order('order_num', { ascending: true });
    
    if (options.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    
    if (options.availableOnly) {
      query = query.eq('is_available', true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as (MenuItem & { category: Category | null })[];
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as MenuItem & { category: Category | null };
  },

  async create(item: Partial<MenuItem>) {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([{
        name: item.name,
        description: item.description || null,
        price: item.price || 0,
        category_id: item.category_id || null,
        image_url: item.image_url || null,
        is_available: item.is_available ?? true,
        is_featured: item.is_featured ?? false,
        order_num: item.order_num || 0,
      }])
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .single();
    
    if (error) throw error;
    return data as MenuItem & { category: Category | null };
  },

  async update(id: number, item: Partial<MenuItem>) {
    const updateData: any = {};
    
    if (item.name !== undefined) updateData.name = item.name;
    if (item.description !== undefined) updateData.description = item.description;
    if (item.price !== undefined) updateData.price = item.price;
    if (item.category_id !== undefined) updateData.category_id = item.category_id;
    if (item.image_url !== undefined) updateData.image_url = item.image_url;
    if (item.is_available !== undefined) updateData.is_available = item.is_available;
    if (item.is_featured !== undefined) updateData.is_featured = item.is_featured;
    if (item.order_num !== undefined) updateData.order_num = item.order_num;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .single();
    
    if (error) throw error;
    return data as MenuItem & { category: Category | null };
  },

  async delete(id: number) {
    // Primero obtener el item para eliminar su imagen si existe
    const item = await menuItemsApi.getById(id);
    if (item?.image_url) {
      await deleteImage(item.image_url);
    }

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async toggleAvailable(id: number, isAvailable: boolean) {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ 
        is_available: isAvailable,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as MenuItem;
  },

  async toggleFeatured(id: number, isFeatured: boolean) {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ 
        is_featured: isFeatured,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as MenuItem;
  }
};

