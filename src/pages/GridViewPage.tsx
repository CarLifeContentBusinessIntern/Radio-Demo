import GridViewItem from "../components/GridViewItem"

function GridViewPage() {
    return (
        <div className="pr-28 pt-3">
            <div className="grid gap-4 mb-4 px-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <GridViewItem title="채널명" subTitle="제작자명" />
                <GridViewItem title="채널명" subTitle="제작자명" />
                <GridViewItem title="채널명" subTitle="제작자명" />
                <GridViewItem title="채널명" subTitle="제작자명" />
                <GridViewItem title="채널명" subTitle="제작자명" />
                <GridViewItem title="채널명" subTitle="제작자명" />
                <GridViewItem title="채널명" subTitle="제작자명" />
                <GridViewItem title="채널명" subTitle="제작자명" />
            </div>
        </div>
    )
}

export default GridViewPage