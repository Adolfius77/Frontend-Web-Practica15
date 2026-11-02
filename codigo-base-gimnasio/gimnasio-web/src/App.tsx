import { Route, Routes, Navigate } from "react-router";
import { Layout } from "./componentes/Layout.tsx";
import PaginaClases from "./pages/paginaClases.tsx";
import PaginaClase from "./pages/paginaClase.tsx";
import { NoEncontrado } from "./componentes/NoEncontrado.tsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/clases" />} />
        <Route path="clases">
          <Route index element={<PaginaClases />} />
          <Route path=":id" element={<PaginaClase />} />
        </Route>
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}
