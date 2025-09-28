import { useForm } from "react-hook-form";
import Switch from "../switch/switch";
const EditUserForm = ({ usuario, onSubmit, isLoading, serverError }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nome: usuario?.nome || "",
            telefone: usuario?.telefone || "",
            endereco: usuario?.endereco || "",
            mensalista: usuario?.mensalista || false,
            valorMensalidade: usuario?.valorMensalidade || "",
        },
    });

    const mensalistaValue = watch("mensalista");

    const handleSwitchChange = (checked) => {
        setValue("mensalista", checked);
        if (!checked) setValue("valorMensalidade", "");
    };

    const internalSubmit = (data) => {
        onSubmit({
            ...data,
            valorMensalidade: data.valorMensalidade ? Number(data.valorMensalidade) : null,
        });
    };

    return (
        <form
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            onSubmit={handleSubmit(internalSubmit)}
        >
            <label>Nome</label>
            <input {...register("nome", { required: "Nome é obrigatório" })} />
            <span style={{ color: "red" }}>
                {errors.nome?.message || serverError?.nome}
            </span>

            <label>Telefone</label>
            <input
                {...register("telefone", {
                    required: "Telefone é obrigatório",
                    validate: (v) =>
                        /^\d+$/.test(v) || "Telefone deve conter apenas números",
                })}
            />
            <span style={{ color: "red" }}>
                {errors.telefone?.message || serverError?.telefone}
            </span>

            <label>Endereço</label>
            <input {...register("endereco", { required: "Endereço é obrigatório" })} />
            <span style={{ color: "red" }}>{errors.endereco?.message}</span>

            <label>Valor da mensalidade</label>
            <input
                {...register("valorMensalidade", {
                    validate: (v) => {
                        if (mensalistaValue) {
                            if (!v) return "Mensalista precisa ter valor";
                            if (isNaN(Number(v))) return "Valor deve ser numérico";
                            if (Number(v) <= 0) return "Valor deve ser positivo";
                        }
                        return true;
                    },
                })}
                disabled={!mensalistaValue}
            />
            <span style={{ color: "red" }}>{errors.valorMensalidade?.message}</span>

            <label>Status de mensalista</label>
            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                <p>Não</p>
                <Switch checked={mensalistaValue} onChange={(e) => handleSwitchChange(e.target.checked)} />
                <p>Sim</p>
            </div>

            <button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Edição"}
            </button>
        </form>
    );
};

export default EditUserForm;
