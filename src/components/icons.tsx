/**
 * PREPLEAGUE - CENTRALIZED ICONS MODULE
 * Replaced Material UI with Lucide React
 * Includes compatibility layer for 'sx' prop
 */

import {
    Home,
    LayoutDashboard,
    Menu,
    X,
    ArrowLeft,
    ArrowRight,
    Rocket,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    MoreHorizontal,
    User,
    UserCircle,
    LogIn,
    LogOut,
    Settings,
    UserCog,
    Mail,
    Lock,
    Bookmark,
    Users,
    Heart,
    GraduationCap,
    BookOpen,
    HelpCircle,
    ClipboardList,
    Lightbulb,
    Brain,
    Calculator,
    Sigma,
    FlaskConical,
    TrendingUp,
    TrendingDown,
    BarChart2,
    PieChart,
    LineChart,
    Activity,
    Gauge,
    Trophy,
    Star,
    Plus,
    Minus,
    MinusCircle,
    Edit2,
    Trash2,
    LayoutGrid,
    Save,
    XCircle,
    Check,
    RefreshCw,
    Search,
    Filter,
    ArrowUpDown,
    Download,
    Upload,
    Share2,
    Copy,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Info,
    BadgeCheck,
    Ban,
    Unlock,
    Accessibility,
    Sun,
    Moon,
    Clock,
    Calendar,
    CalendarRange,
    Timer,
    AlarmClock,
    History,
    FileText,
    Folder,
    FolderOpen,
    File,
    Image,
    Video,
    StickyNote,
    Bell,
    BellRing,
    BellOff,
    MessageSquare,
    MessageCircle,
    MessagesSquare,
    Eye,
    EyeOff,
    BarChart3,
    Flame,
    Zap,
    Play,
    Utensils,
    Target,
    Palette,
    Code,
    Bug,
    Puzzle,
    Wrench,
    Sliders,
    Grid,
    List,
    Table,
    Compass,
    RefreshCcw,
    ShoppingCart,
    Landmark,
    Receipt,
    Book,
    Key,
    Binary,
    Repeat,
    Car,
    Train,
    Droplets,
    RotateCw,
    RotateCcw,
    Ruler,
    ShieldAlert,
    Dices,
    Box,
    ArrowLeftRight,
    Layers,
    Megaphone,
    PenTool,
    Circle,
    ExternalLink
} from 'lucide-react';
import React from 'react';

// Compatibility Layer for MUI 'sx' prop
interface IconProps extends React.SVGProps<SVGSVGElement> {
    sx?: { fontSize?: string | number; color?: string;[key: string]: any };
    size?: string | number;
}

const createIcon = (IconComponent: any) => {
    return ({ sx, className, size, ...props }: IconProps) => {
        // Map MUI fontSize to Lucide size or width/height
        // MUI default is 24px (1.5rem)
        // Lucide default is 24px

        let finalSize = size;
        let finalClass = className || "";
        let style = props.style || {};

        if (sx) {
            if (sx.fontSize) {
                // If standard rem values, map to pixels roughly or pass to style
                if (typeof sx.fontSize === 'string' && sx.fontSize.endsWith('rem')) {
                    // 1.5rem = 24px, 1rem = 16px
                    // Just pass it as style fontSize, Lucide accepts it? No, Lucide uses size prop for w/h
                    // Actually Lucide icons are SVGs. setting font-size on SVG container might work if using 'em' but default is pixel.
                    // Better to map common sizes or set style.
                    style.fontSize = sx.fontSize;
                    style.width = '1em';
                    style.height = '1em';
                } else {
                    style.fontSize = sx.fontSize;
                }
            }
            if (sx.color) {
                style.color = sx.color;
            }
        }

        // If no size provided, Lucide defaults to 24.
        // If we set width/height to 1em, it will scale with fontSize
        if (!finalSize && (style.fontSize || className?.includes('text-'))) {
            // Assume we want to inherit size from font
            return <IconComponent size={finalSize} className={finalClass} style={{ ...style, width: '1em', height: '1em' }} {...props} />;
        }

        return <IconComponent size={finalSize} className={finalClass} style={style} {...props} />;
    };
};

// ========== NAVIGATION ICONS ==========
export const HomeIcon = createIcon(Home);
export const DashboardIcon = createIcon(LayoutDashboard);
export const MenuIcon = createIcon(Menu);
export const CloseIcon = createIcon(X);
export const ArrowBackIcon = createIcon(ArrowLeft);
export const ArrowForwardIcon = createIcon(ArrowRight);
export const RocketLaunchIcon = createIcon(Rocket);
export const ExpandMoreIcon = createIcon(ChevronDown);
export const ExpandLessIcon = createIcon(ChevronUp);
export const ChevronLeftIcon = createIcon(ChevronLeft);
export const ChevronRightIcon = createIcon(ChevronRight);
export const MoreVertIcon = createIcon(MoreVertical);
export const MoreHorizIcon = createIcon(MoreHorizontal);

// ========== USER & ACCOUNT ICONS ==========
export const PersonIcon = createIcon(User);
export const PersonOutlinedIcon = createIcon(User);
export const AccountCircleIcon = createIcon(UserCircle);
export const LoginIcon = createIcon(LogIn);
export const LogoutIcon = createIcon(LogOut);
export const SettingsIcon = createIcon(Settings);
export const ManageAccountsIcon = createIcon(UserCog);
export const EmailOutlinedIcon = createIcon(Mail);
export const LockOutlinedIcon = createIcon(Lock);
export const BookmarkIcon = createIcon(Bookmark);
export const BookmarkBorderIcon = createIcon(Bookmark);
export const MaleIcon = createIcon(User);
export const FemaleIcon = createIcon(User);
export const PeopleIcon = createIcon(Users);
export const FavoriteIcon = createIcon(Heart);
export const DiversityIcon = createIcon(Users);

// ========== LEARNING & EDUCATION ICONS ==========
export const SchoolIcon = createIcon(GraduationCap);
export const MenuBookIcon = createIcon(BookOpen);
export const QuizIcon = createIcon(HelpCircle);
export const AssignmentIcon = createIcon(ClipboardList);
export const LightbulbIcon = createIcon(Lightbulb);
export const PsychologyIcon = createIcon(Brain);
export const CalculateIcon = createIcon(Calculator);
export const FunctionsIcon = createIcon(Sigma);
export const ScienceIcon = createIcon(FlaskConical);
export const EmojiObjectsIcon = createIcon(Lightbulb);

// ========== PROGRESS & STATS ICONS ==========
export const TrendingUpIcon = createIcon(TrendingUp);
export const TrendingDownIcon = createIcon(TrendingDown);
export const BarChartIcon = createIcon(BarChart2);
export const PieChartIcon = createIcon(PieChart);
export const ShowChartIcon = createIcon(LineChart);
export const TimelineIcon = createIcon(Activity);
export const SpeedIcon = createIcon(Gauge);
export const TrophyIcon = createIcon(Trophy);
export const StarIcon = createIcon(Star);
export const StarBorderIcon = createIcon(Star);
export const GradeIcon = createIcon(Star);

// ========== ACTION ICONS ==========
export const AddIcon = createIcon(Plus);
export const RemoveIcon = createIcon(Minus);
export const RemoveCircleIcon = createIcon(MinusCircle);
export const EditIcon = createIcon(Edit2);
export const DeleteIcon = createIcon(Trash2);
export const WidgetsIcon = createIcon(LayoutGrid);
export const SaveIcon = createIcon(Save);
export const CancelIcon = createIcon(XCircle);
export const CheckIcon = createIcon(Check);
export const ClearIcon = createIcon(X);
export const RefreshIcon = createIcon(RefreshCw);
export const SearchIcon = createIcon(Search);
export const FilterIcon = createIcon(Filter);
export const SortIcon = createIcon(ArrowUpDown);
export const DownloadIcon = createIcon(Download);
export const UploadIcon = createIcon(Upload);
export const ShareIcon = createIcon(Share2);
export const CopyIcon = createIcon(Copy);

// ========== STATUS & FEEDBACK ICONS ==========
export const CheckCircleIcon = createIcon(CheckCircle2);
export const ErrorIcon = createIcon(AlertCircle);
export const WarningIcon = createIcon(AlertTriangle);
export const InfoIcon = createIcon(Info);
export const HelpIcon = createIcon(HelpCircle);
export const HelpOutlineIcon = createIcon(HelpCircle);
export const VerifiedIcon = createIcon(BadgeCheck);
export const BlockIcon = createIcon(Ban);
export const LockIcon = createIcon(Lock);
export const LockOpenIcon = createIcon(Unlock);
export const AccessibilityNewIcon = createIcon(Accessibility);
export const WbSunnyIcon = createIcon(Sun);
export const NightsStayIcon = createIcon(Moon);

// ========== TIME & DATE ICONS ==========
export const ClockIcon = createIcon(Clock);
export const AccessTimeIcon = createIcon(Clock);
export const TodayIcon = createIcon(Calendar);
export const CalendarIcon = createIcon(Calendar);
export const DateRangeIcon = createIcon(CalendarRange);
export const ScheduleIcon = createIcon(Clock);
export const TimerIcon = createIcon(Timer);
export const AlarmIcon = createIcon(AlarmClock);
export const HistoryIcon = createIcon(History);

// ========== CONTENT ICONS ==========
export const DocumentIcon = createIcon(FileText);
export const FolderIcon = createIcon(Folder);
export const FolderOpenIcon = createIcon(FolderOpen);
export const FileIcon = createIcon(File);
export const ImageIcon = createIcon(Image);
export const VideoIcon = createIcon(Video);
export const ArticleIcon = createIcon(FileText);
export const NotesIcon = createIcon(StickyNote);

// ========== COMMUNICATION ICONS ==========
export const NotificationIcon = createIcon(Bell);
export const NotificationActiveIcon = createIcon(BellRing);
export const NotificationOffIcon = createIcon(BellOff);
export const EmailIcon = createIcon(Mail);
export const MessageIcon = createIcon(MessageSquare);
export const ChatIcon = createIcon(MessageCircle);
export const CommentIcon = createIcon(MessageSquare);
export const ForumIcon = createIcon(MessagesSquare);

// ========== VISIBILITY ICONS ==========
export const VisibilityIcon = createIcon(Eye);
export const VisibilityOffIcon = createIcon(EyeOff);
export const EyeIcon = createIcon(Eye);
export const EyeOffIcon = createIcon(EyeOff);

// ========== DIFFICULTY & LEVEL ICONS ==========
export const DifficultyIcon = createIcon(BarChart3);
export const FireIcon = createIcon(Flame);
export const BoltIcon = createIcon(Zap);
export const FlashIcon = createIcon(Zap);

// ========== MISCELLANEOUS ICONS ==========
export const PlayArrowIcon = createIcon(Play);
export const RestaurantIcon = createIcon(Utensils);
export const EmojiEventsIcon = createIcon(Trophy);
export const TargetIcon = createIcon(Target);
export const DarkModeIcon = createIcon(Moon);
export const LightModeIcon = createIcon(Sun);
export const PaletteIcon = createIcon(Palette);
export const CodeIcon = createIcon(Code);
export const BugIcon = createIcon(Bug);
export const ExtensionIcon = createIcon(Puzzle);
export const BuildIcon = createIcon(Wrench);
export const TuneIcon = createIcon(Sliders);
export const AppsIcon = createIcon(Grid);
export const GridIcon = createIcon(Grid);
export const ListIcon = createIcon(List);
export const TableIcon = createIcon(Table);
export const ExploreIcon = createIcon(Compass);
export const FlipIcon = createIcon(RefreshCcw);
export const ShoppingCartIcon = createIcon(ShoppingCart);
export const AccountBalanceIcon = createIcon(Landmark);
export const ReceiptLongIcon = createIcon(Receipt);

export const BookIcon = createIcon(Book);
export const KeyIcon = createIcon(Key);
export const NumbersIcon = createIcon(Binary);
export const LoopIcon = createIcon(Repeat);
export const DirectionsRunIcon = createIcon(Activity);
export const DirectionsCarIcon = createIcon(Car);
export const TrainIcon = createIcon(Train);
export const OpacityIcon = createIcon(Droplets);
export const WaterIcon = createIcon(Droplets);
export const RotateRightIcon = createIcon(RotateCw);
export const RotateLeftIcon = createIcon(RotateCcw);
export const RuleIcon = createIcon(Ruler);
export const DangerousIcon = createIcon(ShieldAlert);
export const CasinoIcon = createIcon(Dices);
export const ViewInArIcon = createIcon(Box);
export const CompareArrowsIcon = createIcon(ArrowLeftRight);
export const SwapVertIcon = createIcon(ArrowUpDown);
export const HeightIcon = createIcon(ArrowUpDown);
export const WidthNormalIcon = createIcon(ArrowLeftRight);
export const LayersIcon = createIcon(Layers);

// ========== OUTLINED ICONS (Mapped to same Lucide icons mostly) ==========
export const CalculateOutlinedIcon = createIcon(Calculator);
export const PsychologyOutlinedIcon = createIcon(Brain);
export const BarChartOutlinedIcon = createIcon(BarChart2);
export const CalendarTodayOutlinedIcon = createIcon(Calendar);
export const TrackChangesOutlinedIcon = createIcon(Target);
export const AccessTimeOutlinedIcon = createIcon(Clock);
export const CampaignOutlinedIcon = createIcon(Megaphone);
export const MenuBookOutlinedIcon = createIcon(BookOpen);
export const AssignmentOutlinedIcon = createIcon(ClipboardList);
export const HistoryEduOutlinedIcon = createIcon(PenTool);
export const LeaderboardOutlinedIcon = createIcon(Trophy);
export const CheckCircleOutlinedIcon = createIcon(CheckCircle2);
export const RadioButtonUncheckedOutlinedIcon = createIcon(Circle);
export const SchoolOutlinedIcon = createIcon(GraduationCap);
export const QuizOutlinedIcon = createIcon(HelpCircle);
export const TrendingUpOutlinedIcon = createIcon(TrendingUp);
export const LocalFireDepartmentOutlinedIcon = createIcon(Flame);
export const EmojiEventsOutlinedIcon = createIcon(Trophy);
export const LightbulbOutlinedIcon = createIcon(Lightbulb);
export const WarningAmberOutlinedIcon = createIcon(AlertTriangle);

export const InfoOutlinedIcon = createIcon(Info);
export const WarningOutlinedIcon = createIcon(AlertTriangle);
export const ZoomInOutlinedIcon = createIcon(ArrowLeftRight); // Approximation
export const ZoomOutOutlinedIcon = createIcon(ArrowLeftRight); // Approximation
export const ViewListIcon = createIcon(List);
export const SplitscreenIcon = createIcon(LayoutGrid);
export const FormatListBulletedIcon = createIcon(List);

// Helper function to maintain backward compatibility
export const getIconSize = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
    const sizeMap = {
        xs: '1rem',
        sm: '1.25rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
    };
    return { fontSize: sizeMap[size] };
};

// Export commonly used icon sets as groups (unchanged)
export const NavigationIcons = {
    Home: 'HomeIcon',
    Dashboard: 'DashboardIcon',
    Menu: 'MenuIcon',
    Close: 'CloseIcon',
} as const;

export const ActionIcons = {
    Add: 'AddIcon',
    Edit: 'EditIcon',
    Delete: 'DeleteIcon',
    Save: 'SaveIcon',
    Cancel: 'CancelIcon',
} as const;

export const StatusIcons = {
    Success: 'CheckCircleIcon',
    Error: 'ErrorIcon',
    Warning: 'WarningIcon',
    Info: 'InfoIcon',
} as const;
