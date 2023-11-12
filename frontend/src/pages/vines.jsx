import { Helmet } from "react-helmet-async";

import { VinesView } from "src/sections/vines/view";

// ----------------------------------------------------------------------

export default function VinesPage() {
  return (
    <>
      <Helmet>
        <title> Vines | VineTrack </title>
      </Helmet>

      <VinesView />
    </>
  );
}
