import CardUser from "../../../shared/components/CardUser";
import MainContainer from "../../../shared/layout/MainContainer";
import RoleCard from "../../../shared/components/RoleCard";

const Dashboard = () => {
  return (
    <MainContainer>
      <div className="mt-5">
        <div className="poppins">
          <h1 className=" text-[23px] md:text-[36px] font-semibold text-black">
            Administración
          </h1>
          <p className=" text-[14px] md:text-[24px] font-light text-black">
            Únicamente los que existen en el sistema.
          </p>

          
        </div>

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-10 my-14">
          <CardUser
            title="Ingeniería en TI Digital"
            name="Luisa Pérez"
            email="luisa.perez@example.com"
            employeeNumber="976-222-32-22"
            date="03/04/2025"
            imageUrl="https://img.freepik.com/foto-gratis/primer-plano-joven-profesional-haciendo-contacto-visual-contra-fondo-color_662251-651.jpg?t=st=1744863511~exp=1744867111~hmac=f58a5973015d6a92177db8ed3dc35fed29b88a42441bfe45431e3c6f25625f24&w=740"
            badgeText="APE"
            action={() => console.log("Card User 1 clicked")} //Aqui ira la función que viene de su viewModel
          />
        </div>
        <div className="grid gap-5">
          <RoleCard
            roleName="Admin SYS"
            backgroundColor="bg-indigo-600"
            description="Acceso completo al sistema"
            permissions={{ menus: 3, submenus: 3 }}
            usersCount={1}
            onClick={() => console.log("Presionando el boton en la card1")} //Aqui ira la función que viene de su viewModel
          />
          <RoleCard
            roleName="Admin PE"
            backgroundColor="bg-emerald-600"
            description="Puede editar contenido pero no configuraciones"
            permissions={{ menus: 2, submenus: 3 }}
            usersCount={2}
            onClick={() => console.log("Presionando el boton en la card2 XD")} //Aqui ira la función que viene de su viewModel
          />
        </div>
      </div>
    </MainContainer>
  );
};

export default Dashboard;
