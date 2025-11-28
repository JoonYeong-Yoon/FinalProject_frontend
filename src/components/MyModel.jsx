import { useGLTF } from "@react-three/drei";

export default function MyModel(props) {
  const { scene } = useGLTF("/models/muscle_body.glb");

  return <primitive object={scene} {...props} />;
}
