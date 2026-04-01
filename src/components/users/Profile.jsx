import { useAuth } from "@/context/AuthContext";
import Avatar from "react-avatar";
import { avatarImage } from "@/constants/avatarImage";
import icons from "@/constants/icons";
import "@/styles/ProfileUser.css";

const Profile = ({
  round = true,
  size = "90",
  showInfo = true,
  direction = "column",
}) => {
  const { userAuth } = useAuth();

  const fullname = `${userAuth?.nombre ?? ""} ${userAuth?.apellido ?? ""}`.trim() || "Usuario";
  const isProtected = userAuth?.activacion_dos_pasos === 1;
  const verify2fa = isProtected ? "Protección activada" : "Proteger cuenta";

  return (
    <div className={`user-profile-wrapper user-profile-${direction}`}>
      <Avatar
        src={avatarImage.avatar3}
        name={fullname}
        size={size}
        round={round}
        maxInitials={2}
        className="avatar-shadow"
      />

      {showInfo && (
        <div className={`user-info-container info-${direction}`}>
          <h3 className="user-profile-name">
            <span className="name-star-icon">{icons.star}</span>
            {fullname}
          </h3>

          <div className="user-details-list">
            <div className="profile-pill pill-default">
              {icons.email}
              <span>{userAuth?.correo || "viajero@ejemplo.com"}</span>
            </div>

            {userAuth?.telefono && (
              <div className="profile-pill pill-default">
                {icons.phone}
                <span>{`+52 ${userAuth.telefono}`}</span>
              </div>
            )}

            <div
              className={`profile-pill ${isProtected ? "pill-secure" : "pill-warning"}`}
            >
              {icons.protected}
              <span>{verify2fa}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
