import LogInForm from "../../components/auth/LoginForm";
import AuthLayout from "./AuthPageLayout";


export default function SignIn() {
  return (
    <>
      <AuthLayout>
        <LogInForm />
      </AuthLayout>
    </>
  );
}
