"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ProductQuantities from "../../components/product-quantities";
import CommentForm from "../../components/comment-form";
import PageContainer from "@/components/layout/page-container";
import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { IFoodItem } from "@/types";
import { ApiResponse } from "@/lib/ApiResponse";
import { useToast } from "@/components/ui/use-toast";
import CommentsList from "../../components/CommentsList";
import { Utensils, Clock, Tag, MessageSquare } from "lucide-react";
import Rating from "../../components/rating";

type Props = {
  params: { id: string };
};

export default function ProductDetail({ params }: Props) {
  const [product, setProduct] = useState<IFoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [refreshComments, setRefreshComments] = useState(0);
  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/products/${params.id}`);
      if (response.data.success) {
        setProduct(response.data.product);
      } else {
        setError("Product not found");
      }
    } catch (error) {
      setError((error as Error).message || "Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchProductDetails();
    } else {
      notFound();
    }
  }, [params.id, fetchProductDetails]);

  const handleRatingChange = (newRating: number) => {
    setUserRating(newRating);
  };

  const handleCommentSubmit = async ({ comment }: { comment: string }) => {
    if (session && session.user) {
      try {
        await axios.post<ApiResponse>(`/api/products/${params.id}/comment`, {
          content: comment,
          rating: userRating,
          userId: session.user._id,
          productId: params.id,
        });

        toast({
          description: `Review added successfully to ${product?.name}`,
          className: "bg-primary text-primary-foreground",
        });

        setUserRating(0);
        setRefreshComments((prev) => prev + 1);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage =
          axiosError.response?.data.message ||
          "Review submission failed. Please try again.";

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  if (loading) return <Card className="m-10 p-6 text-center">Loading...</Card>;
  if (error)
    return <Card className="m-10 p-6 text-center text-red-500">{error}</Card>;

  return (
    <PageContainer scrollable={true}>
      {product ? (
        <Card className="m-10 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <Image
                  src={`/assets/images/${product.imageName}`}
                  alt={product.name}
                  width={540}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <h1 className="text-3xl font-bold text-primary">
                  {product.name}
                </h1>
                <Rating value={product.rating} readOnly />
                <p className="text-lg font-semibold text-primary">
                  €{product.price.toFixed(2)}
                </p>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground">
                    La quiche lorraine est une variante de quiche, une tarte
                    salée de la cuisine lorraine et de la cuisine française, à
                    base de pâte brisée ou de pâte feuilletée, de migaine et de
                    lardons.
                  </p>
                </div>
                <Separator />
                {product && (
                  <ProductQuantities className="w-1/2" product={product} />
                )}
                <div className="flex flex-wrap gap-4">
                  <Card className="bg-blue-100 text-blue-800 p-2 flex items-center">
                    <Utensils className="mr-2 h-4 w-4" />
                    {product.cuisine}
                  </Card>
                  <Card className="bg-green-100 text-green-800 p-2 flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {product.repas}
                  </Card>
                  <Card className="bg-yellow-100 text-yellow-800 p-2 flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    {product.repasType}
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
          <Separator className="my-6" />
          <CardFooter className="flex flex-col p-6">
            <div className="w-full max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <MessageSquare className="mr-2" /> Customer Reviews
              </h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Your Rating</h3>
                <Rating
                  value={userRating}
                  onRatingChange={handleRatingChange}
                />
              </div>
              <CommentForm
                className="w-full mb-6"
                onSubmit={handleCommentSubmit}
                isUserLoggedIn={!!session}
              />
              <CommentsList
                productId={params.id}
                refreshTrigger={refreshComments}
              />
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className="m-10 p-6 text-center">Product not found</Card>
      )}
    </PageContainer>
  );
}
