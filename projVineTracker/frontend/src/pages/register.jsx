import { Helmet } from "react-helmet-async";

import { RegisterUserView } from "src/sections/registerUser";

// ----------------------------------------------------------------------

export default function RegisterUserPage() {
  return (
    <>
      <Helmet>
        <title> Register User | VineTrack </title>
      </Helmet>
      <RegisterUserView />
    </>
  );
}
