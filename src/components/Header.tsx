import PickleLogo from "../assets/pickleLogo.svg"
import SearchIcon from "../assets/searchIcon.svg"
import GearIcon from "../assets/gearIcon.svg"
import GridIcon from "../assets/gridIcon.svg"

function Header({ type }: { type: string }) {
    return (
        <div className="flex flex-row justify-between py-4 px-8 bg-black">
            {/* 중간부분 */}
            {type === "home" ?
                <>
                    <div className="flex flex-row gap-20">
                        <img src={PickleLogo} />
                        <div className="flex flex-col items-center gap-1 cursor-pointer">
                            <div className="bg-gray-600 w-10 h-10" />
                            <div className="text-2xl">홈</div>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer">
                            <div className="bg-gray-600 w-10 h-10" />
                            <div className="text-2xl">인기채널</div>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer">
                            <div className="bg-gray-600 w-10 h-10" />
                            <div className="text-2xl">라디오</div>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer">
                            <div className="bg-gray-600 w-10 h-10" />
                            <div className="text-2xl">최근청취</div>
                        </div>
                    </div>
                </> : null}
            {/* 오른쪽 부분 */}
            {type === "home" ?
                <div className="flex flex-row items-center gap-10">
                    <img src={SearchIcon} className="w-8 h-8 cursor-pointer" />
                    <img src={GearIcon} className="w-9 h-9 cursor-pointer" />
                    <img src={GridIcon} className="w-7 h-7 cursor-pointer" />
                </div> : null}

        </div>
    )
}

export default Header;