import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  KanbanSquare,
  Store,
  Wallet,
  MessageSquareText,
  Settings,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

/**
 * Módulos do Portal F5. Cada item mapeia para uma base do Notion e,
 * na maioria dos casos, para um ou mais agentes do sistema (ver CLAUDE.md).
 */
export const navItems: NavItem[] = [
  {
    title: "Visão Geral",
    href: "/",
    icon: LayoutDashboard,
    description: "KPIs, funil consolidado e forecast (Agente 15 — BI).",
  },
  {
    title: "Pipeline",
    href: "/pipeline",
    icon: KanbanSquare,
    description: "Base Controle Geral: leads, temperatura, Score F5, SLA.",
  },
  {
    title: "Parceiros",
    href: "/parceiros",
    icon: Store,
    description: "Lojas parceiras, scorecard, contratos e comissão %.",
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: Wallet,
    description: "Comissões provisionadas x recebidas, repasses.",
  },
  {
    title: "Scripts",
    href: "/scripts",
    icon: MessageSquareText,
    description: "Central de Scripts: taxa de resposta por empresa/etapa.",
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
    description: "Integração com Notion, usuários e preferências.",
  },
];
