let releases = [
    {
        title: "alpha 0.1.0",
        description: "First release of Omega Chess!",
        link: "/releases/alpha-0.1.0",
    }
]
releases = releases.reverse();

export async function GET() {

    /**
     * TODO:
     * 
     * add pagination; 
     * insert into database; 
     * maybe create automation script to generates release notes from merge into prod?
    * */
    return Response.json(releases)
}