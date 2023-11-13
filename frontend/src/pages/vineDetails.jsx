import { Helmet } from "react-helmet-async";

import { VineDetailsView } from "src/sections/vine-details/view";

// ----------------------------------------------------------------------

export default function VineDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Vine Details | VineTrack </title>
      </Helmet>

      <VineDetailsView />
    </>
  );
}
