"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/store";
import { productAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleAffiliateClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      // Registrar click en DB
      await productAPI.registerClick(product.id, window.location.pathname);

      // Redirigir a Amazon (con delay para asegurar registro)
      setTimeout(() => {
        window.open(product.linkAfiliado, "_blank");
      }, 100);

      toast.success("Click registrado ✅");
    } catch (error) {
      console.error("Error registrando click:", error);
      // Igual abrir el link aunque falle el registro
      window.open(product.linkAfiliado, "_blank");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagen */}
      <div className="relative w-full h-48 bg-gray-200">
        <Image
          src={product.imagen}
          alt={product.nombre}
          fill
          className="object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Categoría */}
        <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mb-2">
          {product.categoria}
        </span>

        {/* Nombre */}
        <Link href={`/producto/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 cursor-pointer">
            {product.nombre}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < Math.round(product.rating) ? "★" : "☆"}</span>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">({product.rating}/5)</span>
        </div>

        {/* Precio */}
        <div className="mb-3">
          <span className="text-xl font-bold text-green-600">${product.precioAmazon}</span>
        </div>

        {/* Descripción corta */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.descripcion}
        </p>

        {/* Botón */}
        <button
          onClick={handleAffiliateClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Ver en Amazon ↗
        </button>

        {/* Stats */}