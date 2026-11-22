import { useCallback, useEffect, useState } from "react";
import { getUsers, setUserBlocked } from "../services/userService";
import { useToast } from "../components/ToastProvider";
import Spinner from "../components/Spinner";
import StatusMessage from "../components/StatusMessage";
import Button from "../components/Button";

const ROL_LABELS = { CLIENTE: "Cliente", EMPLEADO: "Empleado", ADMINISTRADOR: "Administrador" };

export default function UsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setUsers(await getUsers());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleBlock = async (user) => {
    setUpdatingId(user.id);

    try {
      await setUserBlocked(user.id, !user.bloqueado);
      toast.success(`${user.nombre} fue ${user.bloqueado ? "desbloqueado" : "bloqueado"}.`);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container page">
      <h1>Usuarios</h1>

      {loading && <Spinner label="Cargando usuarios..." />}
      {!loading && error && <StatusMessage title="No pudimos cargar los usuarios" message={error} onRetry={load} />}

      {!loading && !error && (
        <div className="table-wrap">
          <table className="table">
            <caption className="sr-only">Listado de usuarios</caption>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Teléfono</th>
                <th scope="col">Rol</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.nombre}</td>
                  <td>{user.email}</td>
                  <td>{user.telefono}</td>
                  <td>{ROL_LABELS[user.rol] ?? user.rol}</td>
                  <td>{user.bloqueado ? "Bloqueado" : "Activo"}</td>
                  <td>
                    {user.rol === "CLIENTE" && (
                      <Button
                        variant={user.bloqueado ? "primary" : "danger"}
                        loading={updatingId === user.id}
                        onClick={() => handleToggleBlock(user)}
                      >
                        {user.bloqueado ? "Desbloquear" : "Bloquear"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
