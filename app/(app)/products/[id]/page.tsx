"use client";

import { FoodItem, RootState } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useSelector } from "react-redux";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ProductRating from "../../components/product-rating";
import ProductQuantities from "../../components/product-quantities";
import CommentForm from "../../components/comment-form";
import PageContainer from "@/components/layout/page-container";

type Props = {
  params: { id: string };
};

export default function ProductDetail({ params }: Props) {
  const { id } = params;
  const foods = useSelector((state: RootState) => state.products.products);

  const food = foods.find((item: FoodItem) => item.id === id);

  if (!food) {
    notFound();
  }

  const handleCommentSubmit = () => {
    console.log("click form");
  };

  return (
    <PageContainer scrollable={true}>
      <Card className="m-10">
        <CardContent className="p-4 flex flex-wrap md:flex-nowrap gap-2">
          <div className="w-full md:w-1/2">
            <Image
              src={`/assets/images/${food.imageName}`}
              alt={food.name}
              width={270}
              height={200}
              className="w-full h-auto rounded-xl"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="font-semibold text-lg">{food.name}</h3>
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
                <span className="font-semibold">Prix :</span> €{food.price}
              </p>
              <ProductRating rating={food.rating} />
            </div>
            {/* Quantity component */}
            <ProductQuantities className="mt-5" />
            {/* Food menu category */}
            <div className="flex gap-4 mt-5 text-sm">
              <Card className="bg-blue-700 text-primary-foreground p-2">
                {food.category}
              </Card>
              <Card className="bg-primary text-primary-foreground p-2">
                {food.repas}
              </Card>
              <Card className="bg-lightGreen text-black p-2">
                {food.repasType}
              </Card>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <CommentForm className="w-full" onSubmit={handleCommentSubmit} />
        </CardFooter>
      </Card>
    </PageContainer>
  );
}
