import imgChest1 from "../assets/30a91495dceb6d7fc18038e42fb8026c7916a513.png";

export default function Scene() {
  return (
    <div className="bg-white relative size-full" data-name="Scene 2">
      <div className="absolute bg-[#2ea3bd] h-[1052px] left-[-20px] top-[-27px] w-[1861px]" />
      <div className="absolute h-[3010px] left-[975px] top-[-27px] w-[797px]" data-name="chest 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgChest1} />
      </div>
      <div className="absolute font-['Inter:Bold',sans-serif] font-bold h-[213px] leading-[0] left-[205px] not-italic text-[#fae850] text-[65px] top-[343px] w-[861px]">
        <p className="leading-[normal] mb-0">You are what you eat...</p>
        <p className="leading-[normal]">But your food is changing</p>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[57px] leading-[normal] left-[205px] not-italic text-[40px] text-white top-[541px] w-[736px]">{`(Place Holder for text) `}</p>
      <div className="absolute bg-[#d2d2d2] h-[271px] left-[37px] rounded-[47px] top-[364px] w-[74px]" />
      <div className="absolute left-[59px] size-[30px] top-[383px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
          <circle cx="15" cy="15" fill="var(--fill-0, white)" id="Ellipse 2" r="15" />
        </svg>
      </div>
      <div className="absolute left-[59px] size-[30px] top-[423px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
          <circle cx="15" cy="15" fill="var(--fill-0, #8A8A8A)" id="Ellipse 3" r="15" />
        </svg>
      </div>
      <div className="absolute left-[59px] size-[30px] top-[463px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
          <circle cx="15" cy="15" fill="var(--fill-0, #8A8A8A)" id="Ellipse 3" r="15" />
        </svg>
      </div>
      <div className="absolute left-[59px] size-[30px] top-[503px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
          <circle cx="15" cy="15" fill="var(--fill-0, #8A8A8A)" id="Ellipse 3" r="15" />
        </svg>
      </div>
      <div className="absolute left-[59px] size-[30px] top-[543px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
          <circle cx="15" cy="15" fill="var(--fill-0, #8A8A8A)" id="Ellipse 3" r="15" />
        </svg>
      </div>
      <div className="absolute left-[59px] size-[30px] top-[583px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
          <circle cx="15" cy="15" fill="var(--fill-0, #8A8A8A)" id="Ellipse 3" r="15" />
        </svg>
      </div>
    </div>
  );
}
