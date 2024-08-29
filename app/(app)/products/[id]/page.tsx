"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ProductRating from "../../components/product-rating";
import ProductQuantities from "../../components/product-quantities";
import CommentForm from "../../components/comment-form";
import PageContainer from "@/components/layout/page-container";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { IFoodItem } from "@/types";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  params: { id: string };
};

export default function ProductDetail({ params }: Props) {
  const [product, setProduct] = useState<IFoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0); // Add this line to create a key for the CommentForm
  const { data: session } = useSession();

  const { toast } = useToast();

  useEffect(() => {
    async function fetchProductDetails() {
      setLoading(true);
      try {
        const response = await axios.get(`/api/products/${params.id}`);
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

  const handleCommentSubmit = async ({ comment }: { comment: string }) => {
    if (session && session.user) {
      try {
        const response = await axios.post<ApiResponse>(
          `/api/products/${params.id}/comment`,
          {
            content: comment,
            userId: session.user._id,
            productId: params.id,
          }
        );

        toast({
          description: `Comment added successfully to the ${product?.name}`,
          className:
            "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-4 max-w-xs bg-primary text-primary-foreground rounded shadow-lg border border-primary flex items-center justify-center",
        });

        // Reset the form by updating the key
        setKey((prevKey) => prevKey + 1);

        // Optionally, refresh the product details to show the new comment
        // fetchProductDetails();
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage =
          axiosError.response?.data.message ||
          "There was a problem with your comment submission. Please try again.";

        toast({
          title: "Comment Submission Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  if (loading) return <Card>Loading...</Card>;
  if (error) return <Card>{error}</Card>;
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
            <CommentForm
              key={key} // Add this line to reset the form when key changes
              className="w-full"
              onSubmit={handleCommentSubmit}
              isUserLoggedIn={!!session}
            />
          </CardFooter>
        </Card>
      ) : (
        <Card>Product not found</Card>
      )}
    </PageContainer>
  );
}
