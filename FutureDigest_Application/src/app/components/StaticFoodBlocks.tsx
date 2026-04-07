interface StaticFoodBlocksProps {
  foods: string[];
  isVisible: boolean;
}

export function StaticFoodBlocks({ foods, isVisible }: StaticFoodBlocksProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed pointer-events-none" style={{ zIndex: 10 }}>
      {/* Food blocks - Fixed position on right side */}
      <div className="absolute left-[1224px] top-[301px] flex flex-col gap-[20px]">
        {foods.map((food, index) => (
          <div
            key={index}
            className="bg-[#47c6da] h-[114px] rounded-[25px] w-[325px] flex items-center justify-center"
          >
            <p className="font-['Inter:Bold',sans-serif] font-bold text-[55px] text-center text-white leading-[normal] capitalize">
              {food.toLowerCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}