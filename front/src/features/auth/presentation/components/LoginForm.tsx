import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { observer } from "mobx-react-lite";
import { AuthViewModel } from "../viewModels/AuthViewModel";
import { LoginValidationSchema } from "../validations/LoginSchema";
import Button from "../../../shared/components/Button";
import WrapperInput from "../../../shared/components/WrapperInput";

interface LoginFormProps {
  viewModel: AuthViewModel;
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = observer(({ viewModel, onSuccess }) => {
  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values: any) => {
    const success = await viewModel.login(values.email, values.password);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={LoginValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="space-y-4">
            <div>
              <WrapperInput
                type="email"
                name="email"
                id="email"
                label="Correo Electrónico"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <WrapperInput
                type="password"
                name="password"
                id="password"
                label="Contraseña"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid || viewModel.loading}
                isAdd={true}
                label={
                  isSubmitting || viewModel.loading
                    ? "Iniciando sesión..."
                    : "Iniciar Sesión"
                }
                className="w-full flex justify-center items-center"
              />
            </div>

            {viewModel.error && (
              <div className="p-3 mt-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
                {viewModel.error}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
});

export default LoginForm;