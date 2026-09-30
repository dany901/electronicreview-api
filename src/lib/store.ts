import { create } from "zustand";

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precioAmazon: number;
  linkAfiliado: string;
  imagen: string;
  categoria: string;
  rating: number;
  resena: string;
  especsTecnicos: string[];
  ventajas: string[];
  desventajas: string[];
  clicksRegistrados: number;
  createdAt: string;
  updatedAt: string;
}

interface Store {
  products: Product[];
  selectedCategory: string;
  sortBy: "rating" | "clicks" | "newest";
  setProducts: (products: Product[]) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sortBy: "rating" | "clicks" | "newest") => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useStore = create<Store>((set) => ({
  products: [],
  selectedCategory: "",
  sortBy: "newest",
  setProducts: (products) => set({ products }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSortBy: (sortBy) => set({ sortBy }),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}));