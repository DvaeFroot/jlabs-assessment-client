import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router"
import * as AuthService from "~/services/authService"

type FormError = {
  email?: string,
  pass?: string
  authenticated?: string
}

export default function Login(): React.ReactElement {
  const [email, setEmail] = useState<string>("")
  const [password, setPass] = useState<string>("")
  const [errors, setErrors] = useState<FormError>({})
  const [csrfTokenFetched, setCsrfTokenFetched] = useState<boolean>(false);
  const [hasUser, setHasUser] = useState<any>(true);

  let navigate = useNavigate()

  useEffect((): void => {
    const tokenType = sessionStorage.getItem("token_type");
    const accessToken = sessionStorage.getItem("access_token");

    if (!tokenType || !accessToken) {
      setHasUser(false)
      return;
    }

    const fetchUser = async (): Promise<void> => {
      try {
        const user = await AuthService.getUser(tokenType, accessToken);
        navigate("/home");
      } catch (error) {
        console.log("Error fetching user data:", error);
        setHasUser(false)
      }
    };

    fetchUser();
  }, [navigate]);

  if (hasUser) {
    return <div>
      <div className="flex h-screen w-screen items-center justify-center bg-gray-500">
        Loading...</div></div>;
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPass(e.target.value)
  }

  const validateForm = (): FormError => {
    const validationErrors: FormError = {}

    if (!email) {
      validationErrors.email = "Email is required."
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Email is not valid."
    }
    if (!password) {
      validationErrors.pass = "Password is required."
    } else if (password.length < 8) {
      validationErrors.pass = "Password must be at least 8 characters."
    }

    return validationErrors
  }

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})

    try {
      if (!csrfTokenFetched) {
        await AuthService.getcsrf()
        setCsrfTokenFetched(true);
      }

      const response = await AuthService.login(email, password, setErrors)

      if (!response?.success) {
        throw new Error("Error logging in.")
      }

      sessionStorage.setItem("access_token", response.data.access_token)
      sessionStorage.setItem("token_type", response.data.token_type)

      navigate("/home")
    } catch (error) {
      const validationErrors: FormError = {}
      validationErrors.authenticated = "Incorrect password or email."
      setErrors(validationErrors)
      console.log(error)
    }
  }

  return (
    <>
      {/* PAGE CONTAINER */}
      <div className="flex h-screen w-screen items-center justify-center bg-gray-500">

        {/* LOGIN CONTAINER */}
        <div className="w-[350px] rounded-md bg-gray-300 px-5 py-5 drop-shadow-2xl">

          {/* FORM FIELDS */}
          <div>
            {/* EMAIL */}
            <div>
              <div className="mb-3 font-bold">
                Email
              </div>
              <div className="mb-3">
                <input type="email" onChange={handleEmailChange} className="w-full rounded-lg bg-white px-2 py-2" />
                {errors.email && <div className="mt-2 text-sm text-red-500">{errors.email}</div>}
              </div>
            </div>
            {/* PASSWORD */}
            <div>
              <div className="mb-3 font-bold">
                Password
              </div>
              <div className="mb-3">
                <input type="password" onChange={handlePasswordChange} className="w-full rounded-lg bg-white px-2 py-2" />
                {errors.pass && <div className="mt-2 text-sm text-red-500">{errors.pass}</div>}
              </div>
            </div>
          </div>

          {errors.authenticated && <div className="mt-2 text-sm text-red-500">{errors.authenticated}</div>}

          {/* Login */}
          <div className="mt-5 flex flex-row-reverse">
            <button type="button" onClick={handleLogin} className="w-full cursor-pointer rounded-lg bg-green-500 px-1 py-2 font-bold text-white">
              Log In
            </button>
          </div>

          {/* TO SIGN UP */}
          <div className="mt-5 flex flex-row justify-center text-sm font-light">
            <div className="mr-2">
              Don't have an account?
            </div>
            <NavLink to="/signup">
              <div className="flex items-center justify-end text-blue-500">
                Sign up
              </div>
            </NavLink>
          </div>
        </div >
      </div>
    </>
  )
}
