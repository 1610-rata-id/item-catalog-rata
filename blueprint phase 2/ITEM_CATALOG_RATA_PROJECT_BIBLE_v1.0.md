# ITEM CATALOG RATA

# PROJECT BIBLE

**Version:** 1.0\
**Status:** Baseline Approved

> Living Document --- Blueprint akan berkembang melalui Architecture
> Decision Record (ADR).

------------------------------------------------------------------------

# Executive Summary

ITEM CATALOG RATA berevolusi dari Internal Catalog menjadi Procurement
Analytics Platform. Phase 1 menjadi baseline stabil. Phase 2 berfokus
pada Analytics Platform tanpa merusak fondasi Phase 1.

# Vision

Membangun Procurement Analytics Platform yang aman, scalable, modular,
dan mudah dikembangkan untuk mendukung pengambilan keputusan procurement
berbasis data.

## Mission

-   Menyatukan analytics procurement.
-   Mengurangi ketergantungan spreadsheet.
-   Menyediakan dashboard modern.
-   Menjadi fondasi integrasi Procurement System.

# Engineering Principles

1.  Business First
2.  Architecture Before Code
3.  Security by Design
4.  Performance by Design
5.  Data Independence
6.  Canonical Data Model
7.  Modular Architecture
8.  Single Source of Truth
9.  YAGNI
10. Progressive Enhancement
11. Documentation is Part of Development
12. Backward Compatibility
13. Evolution over Revolution

# Business Requirements

Primary Users: - Procurement Staff - Procurement Manager

Business Goals: - Vendor Performance - Spend Analysis - Purchase
Analysis - Trend Analysis - Category Analysis

Dashboard harus menjawab: - Total Spend - Total Purchase - Active
Vendor - Vendor Ranking - Trend - Category - Item - Transaction Evidence

# Metrics & KPI Dictionary

P0 - Total Spend = SUM(total_price) - Total Purchase = COUNT(DISTINCT
po_number) - Active Vendor = COUNT(DISTINCT vendor) - Average Purchase
Value = Total Spend / Total Purchase

P1 - Vendor Ranking - Vendor Contribution - Purchase Frequency - Spend
per Category - Spend per Item - Monthly Spend

P2 - Monthly Growth - Yearly Growth - Moving Average

# Global Filters

Mandatory: - Year - Month - Vendor - Category - Item Name

Future: - Department - Buyer - Requestor - PR Number - PO Number -
Status

# Data Dictionary

Transaction: - transaction_id - po_number - pr_number - order_date -
vendor - item_name - category - qty - uom - unit_price - total_price

Validation: - Vendor wajib - Item wajib - Category wajib - Qty \> 0 -
Total Price \>= 0

# Canonical Data Model

Datasource → Repository → Canonical Transaction → Analytics Engine →
Dashboard

Analytics hanya mengenal Canonical Transaction.

# Domain Model

Category → Item → Transaction ← Vendor

Analytics selalu berasal dari Transaction.

# Analytics Architecture

Presentation → Dashboard Service → Analytics Engine → Repository →
Datasource Adapter → Datasource

# Information Architecture

Urutan informasi: 1. Summary KPI 2. Trend 3. Distribution 4. Ranking 5.
Detail 6. Transaction

Dashboard adalah Decision Support System.

# UX Flow

Question → Information → Decision → Action

Manager Journey: Overview → Trend → Vendor → Item → Transaction

# Security Baseline

-   Supabase Auth
-   Middleware
-   Protected Route
-   Validation
-   HTTPS
-   Audit Log

# Sprint Strategy

Sprint 1 - Repository Pattern - Canonical Model - Filter Engine -
Dashboard Layout - Design System - Dummy Data

Sprint 2 - Vendor Performance

Sprint 3 - Spend Analysis

Sprint 4 - Trend

Sprint 5 - Reports

# Definition of Done

-   Business requirement terpenuhi
-   Secure
-   Responsive
-   Tested
-   Documented
-   Tidak merusak Phase 1

# Blueprint Governance

Blueprint adalah Living Document.

Status: Baseline Approved

Perubahan dilakukan melalui ADR dan versioning.
