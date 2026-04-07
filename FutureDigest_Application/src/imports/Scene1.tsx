import svgPaths from "./svg-r2pv384azv";
import imgTitle1 from "../assets/a16a85855a3bb3af39a3f72babdcda2905687e67.png";

export default function Scene() {
  return (
    <div className="bg-white relative size-full" data-name="Scene 1">
      <div className="absolute bg-[#2ea3bd] h-[1052px] left-[-20px] top-[-27px] w-[1861px]" />
      <div className="-translate-x-1/2 absolute h-[317px] left-[calc(50%-0.5px)] top-[341px] w-[1432px]" data-name="Title 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgTitle1} />
      </div>
      <p className="-translate-x-1/2 absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[57px] leading-[normal] left-[868px] not-italic text-[40px] text-center text-white top-[820px] w-[736px]">SWIPE DOWN TO GET STARTED</p>
      <div className="absolute flex items-center justify-center left-[831px] size-[74px] top-[877px]">
        <div className="flex-none rotate-180">
          <div className="relative size-[74px]">
            <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64.0859 55.5">
                <path d={svgPaths.pe75b400} fill="var(--fill-0, white)" id="Polygon 1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}