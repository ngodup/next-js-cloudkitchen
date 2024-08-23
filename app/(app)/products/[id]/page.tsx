"use client";

import { FoodItem } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ProductRating from "../../components/product-rating";
import ProductQuantities from "../../components/product-quantities";
import CommentForm from "../../components/comment-form";
import PageContainer from "@/components/layout/page-container";
import { useEffect, useState } from "react";
import baseAPI from "@/app/api/baseAPI";

type Props = {
  params: { id: string };
};

export default function ProductDetail({ params }: Props) {
  const [product, setProduct] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductDetails() {
      setLoading(true);
      try {
        const response = await baseAPI.get(`/products/${params.id}`);
        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          setError("Product not found");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError((error as Error).message || "Failed to fetch product details");
      }
    }

    if (params.id) {
      fetchProductDetails();
    } else {
      notFound();
    }
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleCommentSubmit = () => {
    console.log("click form");
  };

  return (
    <PageContainer scrollable={true}>
      {product ? (
        <Card className="m-10">
          <CardContent className="p-4 flex flex-wrap md:flex-nowrap gap-2">
            <div className="w-full md:w-1/2">
              <Image
                src={`/assets/images/${product.imageName}`}
                alt={product.imageName}
                width={270}
                height={200}
                className="w-full h-auto rounded-xl"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <div className="mb-4">
                <p className="text-sm">
                  <span className="font-semibold">Description: </span>
                  La quiche lorraine est une variante de quiche, une tarte salée
                  de la cuisine lorraine et de la cuisine française, à base de
                  pâte brisée ou de pâte feuilletée, de migaine et de lardons.
                </p>
              </div>
              <div className="flex justify-between">
                <p>
                  <span className="font-semibold">Prix :</span> €{product.price}
                </p>
                <ProductRating rating={product.rating} />
              </div>
              {/* Quantity component */}
              <ProductQuantities className="mt-5" />
              {/* Food menu category */}
              <div className="flex gap-4 mt-5 text-sm">
                <Card className="bg-blue-700 text-primary-foreground p-2">
                  {product.cuisine}
                </Card>
                <Card className="bg-primary text-primary-foreground p-2">
                  {product.repas}
                </Card>
                <Card className="bg-lightGreen text-black p-2">
                  {product.repasType}
                </Card>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <CommentForm className="w-full" onSubmit={handleCommentSubmit} />
          </CardFooter>
        </Card>
      ) : (
        <Card>Product not found</Card>
      )}
    </PageContainer>
  );
}