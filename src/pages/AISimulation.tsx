import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { DatePicker } from "@/components/date-picker"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LlamaService } from '@/services/LlamaService';
import { ThemeProvider } from "@/components/ThemeProvider"

const AISimulation = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [temperature, setTemperature] = useState(0.5);
  const [topP, setTopP] = useState(0.9);
  const [seed, setSeed] = useState<number | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [useDarkTheme, setUseDarkTheme] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [showCitation, setShowCitation] = useState(true);
  const [showAttribution, setShowAttribution] = useState(true);
  const [showSupport, setShowSupport] = useState(true);
  const [showDonateButton, setShowDonateButton] = useState(true);
  const [showContactInfo, setShowContactInfo] = useState(true);
  const [showTermsOfService, setShowTermsOfService] = useState(true);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(true);
  const [showCookiePolicy, setShowCookiePolicy] = useState(true);
  const [showAccessibilityStatement, setShowAccessibilityStatement] = useState(true);
  const [showSecurityPractices, setShowSecurityPractices] = useState(true);
  const [showCodeOfConduct, setShowCodeOfConduct] = useState(true);
  const [showCommunityGuidelines, setShowCommunityGuidelines] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(true);
  const [showBugReportForm, setShowBugReportForm] = useState(true);
  const [showFeatureRequestForm, setShowFeatureRequestForm] = useState(true);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(true);
  const [showFAQSection, setShowFAQSection] = useState(true);
  const [showTutorials, setShowTutorials] = useState(true);
  const [showUserManual, setShowUserManual] = useState(true);
  const [showAPIReference, setShowAPIReference] = useState(true);
  const [showReleaseNotes, setShowReleaseNotes] = useState(true);
  const [showSystemStatus, setShowSystemStatus] = useState(true);
  const [showServerErrorInfo, setShowServerErrorInfo] = useState(true);
  const [showClientErrorInfo, setShowClientErrorInfo] = useState(true);
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(true);
  const [showResourceUsage, setShowResourceUsage] = useState(true);
  const [showSessionManagement, setShowSessionManagement] = useState(true);
  const [showAuthenticationInfo, setShowAuthenticationInfo] = useState(true);
  const [showAuthorizationDetails, setShowAuthorizationDetails] = useState(true);
  const [showDataValidationDetails, setShowDataValidationDetails] = useState(true);
  const [showInputSanitizationDetails, setShowInputSanitizationDetails] = useState(true);
  const [showRateLimitingInfo, setShowRateLimitingInfo] = useState(true);
  const [showErrorHandlingDetails, setShowErrorHandlingDetails] = useState(true);
  const [showLoggingDetails, setShowLoggingDetails] = useState(true);
  const [showMonitoringDetails, setShowMonitoringDetails] = useState(true);
  const [showAlertingDetails, setShowAlertingDetails] = useState(true);
  const [showBackupAndRecoveryDetails, setShowBackupAndRecoveryDetails] = useState(true);
  const [showDisasterRecoveryPlan, setShowDisasterRecoveryPlan] = useState(true);
  const [showIncidentResponsePlan, setShowIncidentResponsePlan] = useState(true);
  const [showSecurityAuditDetails, setShowSecurityAuditDetails] = useState(true);
  const [showComplianceInfo, setShowComplianceInfo] = useState(true);
  const [showDataRetentionPolicy, setShowDataRetentionPolicy] = useState(true);
  const [showDataDeletionPolicy, setShowDataDeletionPolicy] = useState(true);
  const [showDataBreachResponsePlan, setShowDataBreachResponsePlan] = useState(true);
  const [showVulnerabilityManagementDetails, setShowVulnerabilityManagementDetails] = useState(true);
  const [showPenetrationTestingDetails, setShowPenetrationTestingDetails] = useState(true);
  const [showThreatModelingDetails, setShowThreatModelingDetails] = useState(true);
  const [showSecureCodingPractices, setShowSecureCodingPractices] = useState(true);
  const [showAccessControlDetails, setShowAccessControlDetails] = useState(true);
  const [showEncryptionDetails, setShowEncryptionDetails] = useState(true);
  const [showNetworkSecurityDetails, setShowNetworkSecurityDetails] = useState(true);
  const [showPhysicalSecurityDetails, setShowPhysicalSecurityDetails] = useState(true);
  const [showThirdPartySecurityDetails, setShowThirdPartySecurityDetails] = useState(true);
  const [showSecurityAwarenessTrainingDetails, setShowSecurityAwarenessTrainingDetails] = useState(true);
  const [showSecurityIncidentReportingProcess, setShowSecurityIncidentReportingProcess] = useState(true);
  const [showSecurityVulnerabilityDisclosurePolicy, setShowSecurityVulnerabilityDisclosurePolicy] = useState(true);
  const [showResponsibleAIDevelopmentPractices, setShowResponsibleAIDevelopmentPractices] = useState(true);
  const [showEthicalConsiderations, setShowEthicalConsiderations] = useState(true);
  const [showBiasDetectionAndMitigationStrategies, setShowBiasDetectionAndMitigationStrategies] = useState(true);
  const [showFairnessMetrics, setShowFairnessMetrics] = useState(true);
  const [showTransparencyAndExplainabilityDetails, setShowTransparencyAndExplainabilityDetails] = useState(true);
  const [showAccountabilityMechanisms, setShowAccountabilityMechanisms] = useState(true);
  const [showHumanOversightDetails, setShowHumanOversightDetails] = useState(true);
  const [showUserControlDetails, setShowUserControlDetails] = useState(true);
  const [showPrivacyEnhancingTechnologies, setShowPrivacyEnhancingTechnologies] = useState(true);
  const [showDifferentialPrivacyDetails, setShowDifferentialPrivacyDetails] = useState(true);
  const [showFederatedLearningDetails, setShowFederatedLearningDetails] = useState(true);
  const [showSecureMultiPartyComputationDetails, setShowSecureMultiPartyComputationDetails] = useState(true);
  const [showHomomorphicEncryptionDetails, setShowHomomorphicEncryptionDetails] = useState(true);
  const [showDataAnonymizationTechniques, setShowDataAnonymizationTechniques] = useState(true);
  const [showDataPseudonymizationTechniques, setShowDataPseudonymizationTechniques] = useState(true);
  const [showDataDeidentificationTechniques, setShowDataDeidentificationTechniques] = useState(true);
  const [showDataMinimizationTechniques, setShowDataMinimizationTechniques] = useState(true);
  const [showPurposeLimitationDetails, setShowPurposeLimitationDetails] = useState(true);
  const [showDataSubjectRightsDetails, setShowDataSubjectRightsDetails] = useState(true);
  const [showRightToAccessDetails, setShowRightToAccessDetails] = useState(true);
  const [showRightToRectificationDetails, setShowRightToRectificationDetails] = useState(true);
  const [showRightToErasureDetails, setShowRightToErasureDetails] = useState(true);
  const [showRightToRestrictionOfProcessingDetails, setShowRightToRestrictionOfProcessingDetails] = useState(true);
  const [showRightToDataPortabilityDetails, setShowRightToDataPortabilityDetails] = useState(true);
  const [showRightToObjectDetails, setShowRightToObjectDetails] = useState(true);
  const [showAutomatedDecisionMakingDetails, setShowAutomatedDecisionMakingDetails] = useState(true);
  const [showProfilingDetails, setShowProfilingDetails] = useState(true);
  const [showLegalBasisForProcessingDetails, setShowLegalBasisForProcessingDetails] = useState(true);
  const [showConsentManagementDetails, setShowConsentManagementDetails] = useState(true);
  const [showDataTransferDetails, setShowDataTransferDetails] = useState(true);
  const [showInternationalDataTransferDetails, setShowInternationalDataTransferDetails] = useState(true);
  const [showCrossBorderDataTransferDetails, setShowCrossBorderDataTransferDetails] = useState(true);
  const [showStandardContractualClausesDetails, setShowStandardContractualClausesDetails] = useState(true);
  const [showBindingCorporateRulesDetails, setShowBindingCorporateRulesDetails] = useState(true);
  const [showAdequacyDecisionsDetails, setShowAdequacyDecisionsDetails] = useState(true);
  const [showDataLocalizationDetails, setShowDataLocalizationDetails] = useState(true);
  const [showDataResidencyDetails, setShowDataResidencyDetails] = useState(true);
  const [showSovereigntyRequirementsDetails, setShowSovereigntyRequirementsDetails] = useState(true);
  const [showGeographicRestrictionsDetails, setShowGeographicRestrictionsDetails] = useState(true);
  const [showDataGovernanceFrameworkDetails, setShowDataGovernanceFrameworkDetails] = useState(true);
  const [showDataStewardshipDetails, setShowDataStewardshipDetails] = useState(true);
  const [showDataQualityManagementDetails, setShowDataQualityManagementDetails] = useState(true);
  const [showMetadataManagementDetails, setShowMetadataManagementDetails] = useState(true);
  const [showDataCatalogDetails, setShowDataCatalogDetails] = useState(true);
  const [showDataDictionaryDetails, setShowDataDictionaryDetails] = useState(true);
  const [showDataLineageDetails, setShowDataLineageDetails] = useState(true);
  const [showDataDiscoveryDetails, setShowDataDiscoveryDetails] = useState(true);
  const [showDataClassificationDetails, setShowDataClassificationDetails] = useState(true);
  const [showDataTaggingDetails, setShowDataTaggingDetails] = useState(true);
  const [showDataVersioningDetails, setShowDataVersioningDetails] = useState(true);
  const [showDataArchivingDetails, setShowDataArchivingDetails] = useState(true);
  const [showDataLifecycleManagementDetails, setShowDataLifecycleManagementDetails] = useState(true);
  const [showDataSecurityDetails, setShowDataSecurityDetails] = useState(true);
  const [showDataEncryptionDetails, setShowDataEncryptionDetails] = useState(true);
  const [showDataMaskingDetails, setShowDataMaskingDetails] = useState(true);
  const [showDataTokenizationDetails, setShowDataTokenizationDetails] = useState(true);
  const [showDataLossPreventionDetails, setShowDataLossPreventionDetails] = useState(true);
  const [showDataAccessControlsDetails, setShowDataAccessControlsDetails] = useState(true);
  const [showDataBreachPreventionDetails, setShowDataBreachPreventionDetails] = useState(true);
  const [showDataResilienceDetails, setShowDataResilienceDetails] = useState(true);
  const [showDataBackupAndRecoveryDetails, setShowDataBackupAndRecoveryDetails] = useState(true);
  const [showDataDisasterRecoveryDetails, setShowDataDisasterRecoveryDetails] = useState(true);
  const [showDataIncidentResponseDetails, setShowDataIncidentResponseDetails] = useState(true);
  const [showDataPrivacyDetails, setShowDataPrivacyDetails] = useState(true);
  const [showDataConsentDetails, setShowDataConsentDetails] = useState(true);
  const [showDataTransparencyDetails, setShowDataTransparencyDetails] = useState(true);
  const [showDataAccountabilityDetails, setShowDataAccountabilityDetails] = useState(true);
  const [showDataEthicsDetails, setShowDataEthicsDetails] = useState(true);
  const [showDataBiasDetails, setShowDataBiasDetails] = useState(true);
  const [showDataFairnessDetails, setShowDataFairnessDetails] = useState(true);
  const [showDataExplainabilityDetails, setShowDataExplainabilityDetails] = useState(true);
  const [showDataHumanOversightDetails, setShowDataHumanOversightDetails] = useState(true);
  const [showDataUserControlDetails, setShowDataUserControlDetails] = useState(true);
  const [showDataPrivacyEnhancingTechnologiesDetails, setShowDataPrivacyEnhancingTechnologiesDetails] = useState(true);
  const [showDataDifferentialPrivacyDetails, setShowDataDifferentialPrivacyDetails] = useState(true);
  const [showDataFederatedLearningDetails, setShowDataFederatedLearningDetails] = useState(true);
  const [showDataSecureMultiPartyComputationDetails, setShowDataSecureMultiPartyComputationDetails] = useState(true);
  const [showDataHomomorphicEncryptionDetails, setShowDataHomomorphicEncryptionDetails] = useState(true);
  const [showDataAnonymizationDetails, setShowDataAnonymizationDetails] = useState(true);
  const [showDataPseudonymizationDetails, setShowDataPseudonymizationDetails] = useState(true);
  const [showDataDeidentificationDetails, setShowDataDeidentificationDetails] = useState(true);
  const [showDataMinimizationDetails, setShowDataMinimizationDetails] = useState(true);
  const [showDataPurposeLimitationDetails, setShowDataPurposeLimitationDetails] = useState(true);
  const [showDataSubjectRightsDetails, setShowDataSubjectRightsDetails] = useState(true);
  const [showDataRightToAccessDetails, setShowDataRightToAccessDetails] = useState(true);
  const [showDataRightToRectificationDetails, setShowDataRightToRectificationDetails] = useState(true);
  const [showDataRightToErasureDetails, setShowDataRightToErasureDetails] = useState(true);
  const [showDataRightToRestrictionOfProcessingDetails, setShowDataRightToRestrictionOfProcessingDetails] = useState(true);
  const [showDataRightToDataPortabilityDetails, setShowDataRightToDataPortabilityDetails] = useState(true);
  const [showDataRightToObjectDetails, setShowDataRightToObjectDetails] = useState(true);
  const [showDataAutomatedDecisionMakingDetails, setShowDataAutomatedDecisionMakingDetails] = useState(true);
  const [showDataProfilingDetails, setShowDataProfilingDetails] = useState(true);
  const [showDataLegalBasisForProcessingDetails, setShowDataLegalBasisForProcessingDetails] = useState(true);
  const [showDataConsentManagementDetails, setShowDataConsentManagementDetails] = useState(true);
  const [showDataTransferDetails, setShowDataTransferDetails] = useState(true);
  const [showDataInternationalDataTransferDetails, setShowDataInternationalDataTransferDetails] = useState(true);
  const [showDataCrossBorderDataTransferDetails, setShowDataCrossBorderDataTransferDetails] = useState(true);
  const [showDataStandardContractualClausesDetails, setShowDataStandardContractualClausesDetails] = useState(true);
  const [showDataBindingCorporateRulesDetails, setShowDataBindingCorporateRulesDetails] = useState(true);
  const [showDataAdequacyDecisionsDetails, setShowDataAdequacyDecisionsDetails] = useState(true);
  const [showDataLocalizationDetails, setShowDataLocalizationDetails] = useState(true);
  const [showDataResidencyDetails, setShowDataResidencyDetails] = useState(true);
  const [showDataSovereigntyRequirementsDetails, setShowDataSovereigntyRequirementsDetails] = useState(true);
  const [showDataGeographicRestrictionsDetails, setShowDataGeographicRestrictionsDetails] = useState(true);
  const [showDataGovernanceDetails, setShowDataGovernanceDetails] = useState(true);
  const [showDataStewardshipDetails, setShowDataStewardshipDetails] = useState(true);
  const [showDataQualityDetails, setShowDataQualityDetails] = useState(true);
  const [showDataMetadataDetails, setShowDataMetadataDetails] = useState(true);
  const [showDataCatalogDetails, setShowDataCatalogDetails] = useState(true);
  const [showDataDictionaryDetails, setShowDataDictionaryDetails] = useState(true);
  const [showDataLineageDetails, setShowDataLineageDetails] = useState(true);
  const [showDataDiscoveryDetails, setShowDataDiscoveryDetails] = useState(true);
  const [showDataClassificationDetails, setShowDataClassificationDetails] = useState(true);
  const [showDataTaggingDetails, setShowDataTaggingDetails] = useState(true);
  const [showDataVersioningDetails, setShowDataVersioningDetails] = useState(true);
  const [showDataArchivingDetails, setShowDataArchivingDetails] = useState(true);
  const [showDataLifecycleDetails, setShowDataLifecycleDetails] = useState(true);
  const [showDataSecurityMeasuresDetails, setShowDataSecurityMeasuresDetails] = useState(true);
  const [showDataPrivacyPracticesDetails, setShowDataPrivacyPracticesDetails] = useState(true);
  const [showDataEthicalConsiderationsDetails, setShowDataEthicalConsiderationsDetails] = useState(true);
  const [showDataBiasMitigationDetails, setShowDataBiasMitigationDetails] = useState(true);
  const [showDataFairnessMetricsDetails, setShowDataFairnessMetricsDetails] = useState(true);
  const [showDataTransparencyDetailsDetails, setShowDataTransparencyDetailsDetails] = useState(true);
  const [showDataAccountabilityDetailsDetails, setShowDataAccountabilityDetailsDetails] = useState(true);
  const [showDataHumanOversightDetailsDetails, setShowDataHumanOversightDetailsDetails] = useState(true);
  const [showDataUserControlDetailsDetails, setShowDataUserControlDetailsDetails] = useState(true);
  const [showDataPrivacyEnhancingTechnologiesDetailsDetails, setShowDataPrivacyEnhancingTechnologiesDetailsDetails] = useState(true);
  const [showDataDifferentialPrivacyDetailsDetails, setShowDataDifferentialPrivacyDetailsDetails] = useState(true);
  const [showDataFederatedLearningDetailsDetails, setShowDataFederatedLearningDetailsDetails] = useState(true);
  const [showDataSecureMultiPartyComputationDetailsDetails, setShowDataSecureMultiPartyComputationDetailsDetails] = useState(true);
  const [showDataHomomorphicEncryptionDetailsDetails, setShowDataHomomorphicEncryptionDetailsDetails] = useState(true);
  const [showDataAnonymizationTechniquesDetails, setShowDataAnonymizationTechniquesDetails] = useState(true);
  const [showDataPseudonymizationTechniquesDetails, setShowDataPseudonymizationTechniquesDetails] = useState(true);
  const [showDataDeidentificationTechniquesDetails, setShowDataDeidentificationTechniquesDetails] = useState(true);
  const [showDataMinimizationTechniquesDetails, setShowDataMinimizationTechniquesDetails] = useState(true);
  const [showDataPurposeLimitationDetailsDetails, setShowDataPurposeLimitationDetailsDetails] = useState(true);
  const [showDataSubjectRightsDetailsDetails, setShowDataSubjectRightsDetailsDetails] = useState(true);
  const [showDataRightToAccessDetailsDetails, setShowDataRightToAccessDetailsDetails] = useState(true);
  const [showDataRightToRectificationDetailsDetails, setShowDataRightToRectificationDetailsDetails] = useState(true);
  const [showDataRightToErasureDetailsDetails, setShowDataRightToErasureDetailsDetails] = useState(true);
  const [showDataRightToRestrictionOfProcessingDetailsDetails, setShowDataRightToRestrictionOfProcessingDetailsDetails] = useState(true);
  const [showDataRightToDataPortabilityDetailsDetails, setShowDataRightToDataPortabilityDetailsDetails] = useState(true);
  const [showDataRightToObjectDetailsDetails, setShowDataRightToObjectDetailsDetails] = useState(true);
  const [showDataAutomatedDecisionMakingDetailsDetails, setShowDataAutomatedDecisionMakingDetailsDetails] = useState(true);
  const [showDataProfilingDetailsDetails, setShowDataProfilingDetailsDetails] = useState(true);
  const [showDataLegalBasisForProcessingDetailsDetails, setShowDataLegalBasisForProcessingDetailsDetails] = useState(true);
  const [showDataConsentManagementDetailsDetails, setShowDataConsentManagementDetailsDetails] = useState(true);
  const [showDataTransferDetailsDetails, setShowDataTransferDetailsDetails] = useState(true);
  const [showDataInternationalDataTransferDetailsDetails, setShowDataInternationalDataTransferDetailsDetails] = useState(true);
  const [showDataCrossBorderDataTransferDetailsDetails, setShowDataCrossBorderDataTransferDetailsDetails] = useState(true);
  const [showDataStandardContractualClausesDetailsDetails, setShowDataStandardContractualClausesDetailsDetails] = useState(true);
  const [showDataBindingCorporateRulesDetailsDetails, setShowDataBindingCorporateRulesDetailsDetails] = useState(true);
  const [showDataAdequacyDecisionsDetailsDetails, setShowDataAdequacyDecisionsDetailsDetails] = useState(true);
  const [showDataLocalizationDetailsDetails, setShowDataLocalizationDetailsDetails] = useState(true);
  const [showDataResidencyDetailsDetails, setShowDataResidencyDetailsDetails] = useState(true);
  const [showDataSovereigntyRequirementsDetailsDetails, setShowDataSovereigntyRequirementsDetailsDetails] = useState(true);
  const [showDataGeographicRestrictionsDetailsDetails, setShowDataGeographicRestrictionsDetailsDetails] = useState(true);
  const [showDataGovernanceFrameworkDetailsDetails, setShowDataGovernanceFrameworkDetailsDetails] = useState(true);
  const [showDataStewardshipDetailsDetails, setShowDataStewardshipDetailsDetails] = useState(true);
  const [showDataQualityManagementDetailsDetails, setShowDataQualityManagementDetailsDetails] = useState(true);
  const [showDataMetadataManagementDetailsDetails, setShowDataMetadataManagementDetailsDetails] = useState(true);
  const [showDataCatalogDetailsDetails, setShowDataCatalogDetailsDetails] = useState(true);
  const [showDataDictionaryDetailsDetails, setShowDataDictionaryDetailsDetails] = useState(true);
  const [showDataLineageDetailsDetails, setShowDataLineageDetailsDetails] = useState(true);
  const [showDataDiscoveryDetailsDetails, setShowDataDiscoveryDetailsDetails] = useState(true);
  const [showDataClassificationDetailsDetails, setShowDataClassificationDetailsDetails] = useState(true);
  const [showDataTaggingDetailsDetails, setShowDataTaggingDetailsDetails] = useState(true);
  const [showDataVersioningDetailsDetails, setShowDataVersioningDetailsDetails] = useState(true);
  const [showDataArchivingDetailsDetails, setShowDataArchivingDetailsDetails] = useState(true);
  const [showDataLifecycleManagementDetailsDetails, setShowDataLifecycleManagementDetailsDetails] = useState(true);
  const [showDataSecurityMeasuresDetailsDetails, setShowDataSecurityMeasuresDetailsDetails] = useState(true);
  const [showDataPrivacyPracticesDetailsDetails, setShowDataPrivacyPracticesDetailsDetails] = useState(true);
  const [showDataEthicalConsiderationsDetailsDetails, setShowDataEthicalConsiderationsDetailsDetails] = useState(true);
  const [showDataBiasMitigationDetailsDetails, setShowDataBiasMitigationDetailsDetails] = useState(true);
  const [showDataFairnessMetricsDetailsDetails, setShowDataFairnessMetricsDetailsDetails] = useState(true);
  const [showDataTransparencyDetailsDetailsDetails, setShowDataTransparencyDetailsDetailsDetails] = useState(true);
  const [showDataAccountabilityDetailsDetailsDetails, setShowDataAccountabilityDetailsDetailsDetails] = useState(true);
  const [showDataHumanOversightDetailsDetailsDetails, setShowDataHumanOversightDetailsDetailsDetails] = useState(true);
  const [showDataUserControlDetailsDetailsDetails, setShowDataUserControlDetailsDetailsDetails] = useState(true);
  const [showDataPrivacyEnhancingTechnologiesDetailsDetailsDetails, setShowDataPrivacyEnhancingTechnologiesDetailsDetailsDetails] = useState(true);
  const [showDataDifferentialPrivacyDetailsDetailsDetails, setShowDataDifferentialPrivacyDetailsDetailsDetails] = useState(true);
  const [showDataFederatedLearningDetailsDetailsDetails, setShowDataFederatedLearningDetailsDetailsDetails] = useState(true);
  const [showDataSecureMultiPartyComputationDetailsDetailsDetails, setShowDataSecureMultiPartyComputationDetailsDetailsDetails] = useState(true);
  const [showDataHomomorphicEncryptionDetailsDetailsDetails, setShowDataHomomorphicEncryptionDetailsDetailsDetails] = useState(true);
  const [showDataAnonymizationTechniquesDetailsDetails, setShowDataAnonymizationTechniquesDetailsDetails] = useState(true);
  const [showDataPseudonymizationTechniquesDetailsDetails, setShowDataPseudonymizationTechniquesDetailsDetails] = useState(true);
  const [showDataDeidentificationTechniquesDetailsDetails, setShowDataDeidentificationTechniquesDetailsDetails] = useState(true);
  const [showDataMinimizationTechniquesDetailsDetails, setShowDataMinimizationTechniquesDetailsDetails] = useState(true);
  const [showDataPurposeLimitationDetailsDetailsDetails, setShowDataPurposeLimitationDetailsDetailsDetails] = useState(true);
  const [showDataSubjectRightsDetailsDetailsDetails, setShowDataSubjectRightsDetailsDetailsDetails] = useState(true);
  const [showDataRightToAccessDetailsDetailsDetails, setShowDataRightToAccessDetailsDetailsDetails] = useState(true);
  const [showDataRightToRectificationDetailsDetailsDetails, setShowDataRightToRectificationDetailsDetailsDetails] = useState(true);
  const [showDataRightToErasureDetailsDetailsDetails, setShowDataRightToErasureDetailsDetailsDetails] = useState(true);
  const [showDataRightToRestrictionOfProcessingDetailsDetailsDetails, setShowDataRightToRestrictionOfProcessingDetailsDetailsDetails] = useState(true);
  const [showDataRightToDataPortabilityDetailsDetailsDetails, setShowDataRightToDataPortabilityDetailsDetailsDetails] = useState(true);
  const [showDataRightToObjectDetailsDetailsDetails, setShowDataRightToObjectDetailsDetailsDetails] = useState(true);
  const [showDataAutomatedDecisionMakingDetailsDetailsDetails, setShowDataAutomatedDecisionMakingDetailsDetailsDetails] = useState(true);
  const [showDataProfilingDetailsDetailsDetails, setShowDataProfilingDetailsDetailsDetails] = useState(true);
  const [showDataLegalBasisForProcessingDetailsDetailsDetails, setShowDataLegalBasisForProcessingDetailsDetailsDetails] = useState(true);
  const [showDataConsentManagementDetailsDetailsDetails, setShowDataConsentManagementDetailsDetailsDetails] = useState(true);
  const [showDataTransferDetailsDetailsDetails, setShowDataTransferDetailsDetailsDetails] = useState(true);
  const [showDataInternationalDataTransferDetailsDetailsDetails, setShowDataInternationalDataTransferDetailsDetailsDetails] = useState(true);
  const [showDataCrossBorderDataTransferDetailsDetailsDetails, setShowDataCrossBorderDataTransferDetailsDetailsDetails] = useState(true);
  const [showDataStandardContractualClausesDetailsDetailsDetails, setShowDataStandardContractualClausesDetailsDetailsDetails] = useState(true);
  const [showDataBindingCorporateRulesDetailsDetailsDetails, setShowDataBindingCorporateRulesDetailsDetailsDetails] = useState(true);
  const [showDataAdequacyDecisionsDetailsDetailsDetails, setShowDataAdequacyDecisionsDetailsDetailsDetails] = useState(true);
  const [showDataLocalizationDetailsDetailsDetails, setShowDataLocalizationDetailsDetailsDetails] = useState(true);
  const [showDataResidencyDetailsDetailsDetails, setShowDataResidencyDetailsDetailsDetails] = useState(true);
  const [showDataSovereigntyRequirementsDetailsDetailsDetails, setShowDataSovereigntyRequirementsDetailsDetailsDetails] = useState(true);
  const [showDataGeographicRestrictionsDetailsDetailsDetails, setShowDataGeographicRestrictionsDetailsDetailsDetails] = useState(true);
  const [llamaInstance, setLlamaInstance] = useState<LlamaService | null>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const initializeLlama = async () => {
      const instance = LlamaService.getInstance();
      setLlamaInstance(instance);
      setIsModelLoading(true);
      try {
        await instance.loadModel();
      } catch (error) {
        console.error("Failed to load the LLaMA model:", error);
        toast({
          title: "Error",
          description: "Failed to load the LLaMA model.",
          variant: "destructive",
        });
      } finally {
        setIsModelLoading(false);
      }
    };

    initializeLlama();
  }, []);

  const handleSend = useCallback(async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setResponse('');
    setStreamedResponse('');
    setIsCopied(false);

    try {
      if (!llamaInstance) {
        throw new Error("LLaMA model service not initialized.");
      }

      const response = await llamaInstance.generateResponse(message);
      setResponse(response);
    } catch (error: any) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate response.",
        variant: "destructive",
      });
      setResponse(`Error: ${error.message || 'Failed to generate response.'}`);
    } finally {
      setIsLoading(false);
    }
  }, [message, llamaInstance, toast]);

  const handleStream = useCallback(async () => {
    if (!message.trim()) return;

    setIsStreaming(true);
    setStreamedResponse('');
    setIsCopied(false);

    // Simulate streaming response
    let simulatedStream = "";
    const words = message.split(" ");
    const interval = 50; // Simulate word-by-word streaming

    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, interval));
      simulatedStream += words[i] + " ";
      setStreamedResponse(simulatedStream);
    }

    setIsStreaming(false);
  }, [message]);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(response);
    setIsCopied(true);
    toast({
      title: "Copied!",
      description: "Response copied to clipboard.",
    });
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
  };

  const examples = [
    "Analyze the heat transfer in a reactor.",
    "Evaluate the fluid flow dynamics in a pipe.",
    "Assess the thermodynamic equilibrium of a mixture.",
    "Suggest improvements for a distillation column.",
    "Model the kinetics of a chemical reaction.",
    "Calculate the energy efficiency of a process.",
    "Estimate the economic viability of a plant.",
    "Identify potential environmental impacts.",
    "Optimize the separation process in a unit.",
    "Simulate the performance of a heat exchanger.",
    "Predict the yield of a chemical reaction.",
    "Determine the optimal operating conditions.",
    "Troubleshoot a process control issue.",
    "Design a new chemical process.",
    "Scale-up a laboratory process to industrial scale.",
    "Assess the safety of a chemical plant.",
    "Comply with environmental regulations.",
    "Reduce waste generation in a process.",
    "Improve the sustainability of a chemical plant.",
    "Implement green chemistry principles.",
    "Use renewable energy sources.",
    "Reduce greenhouse gas emissions.",
    "Conserve water resources.",
    "Minimize air pollution.",
    "Prevent soil contamination.",
    "Protect biodiversity.",
    "Promote circular economy.",
    "Engage stakeholders.",
    "Communicate environmental performance.",
    "Report environmental data.",
    "Verify environmental claims.",
    "Certify environmental management systems.",
    "Audit environmental performance.",
    "Invest in environmental technologies.",
    "Support environmental research.",
    "Educate the public about environmental issues.",
    "Advocate for environmental policies.",
    "Partner with environmental organizations.",
    "Donate to environmental causes.",
    "Volunteer for environmental projects.",
    "Reduce your carbon footprint.",
    "Conserve energy at home.",
    "Use public transportation.",
    "Bike or walk instead of driving.",
    "Eat less meat.",
    "Buy local and organic food.",
    "Reduce your consumption.",
    "Reuse and recycle.",
    "Compost your food waste.",
    "Plant trees.",
    "Support sustainable businesses.",
    "Vote for environmental candidates.",
    "Contact your elected officials.",
    "Join an environmental organization.",
    "Donate to environmental causes.",
    "Volunteer for environmental projects.",
    "Educate yourself about environmental issues.",
    "Talk to your friends and family about environmental issues.",
    "Make a difference in your community.",
    "Help protect the planet.",
    "Save the environment.",
    "Go green.",
    "Be sustainable.",
    "Live responsibly.",
    "Think globally, act locally.",
    "Every little bit helps.",
    "Together, we can make a difference.",
    "The future of our planet depends on us.",
    "Let's create a better world for future generations.",
    "What is the impact of varying the reflux ratio in a distillation column?",
    "How does the choice of catalyst affect the yield of a reaction?",
    "Can you suggest a more energy-efficient design for a heat exchanger network?",
    "What are the key factors affecting the stability of a chemical reactor?",
    "How can I optimize the operating conditions of a separation process?",
    "What are the environmental impacts of using a particular solvent?",
    "Can you help me troubleshoot a control issue in my process?",
    "What are the safety considerations for handling a hazardous chemical?",
    "
